const Network =  import('../config/api') 
const XHR = import('../utils/xhr')

export default class{
	constructor(){
		this.timestamp = new Date().getTime()
	}
	
	async lists(opt = {}){
		return await new Promise((resolve, reject) => {
			Network.then(net => {
					const url	=	`${net.default.url}/bidding/?status=${opt.filter || 'all'}&page=${opt.page || 1}&token=${opt.token}`
					// XHR
					XHR.then(loader => {
						const http = new loader.default()
						http.request({method:'GET',	url:url}).then(res => res ? resolve(JSON.parse(res)) : '')
					})
			})
		 
		})
	}

	view(opt = {}){
		return new Promise((resolve, reject) => {
			Network.then(net => {
				fetch(`${net.default.url}/bidding/?id=${opt.id}&token=${opt.token}`).then(res => {
					resolve(res.json())
				})
			})
		})
	}

	status(opt){
		return new Promise((resolve, reject) => {
			Network.then(net => {
				fetch(`${net.default.url}/bidding/status.php/?timestamp=${this.timestamp}`,
				{
					method: 'POST',
					body: JSON.stringify(opt),
				})
				.then(res => {
					resolve(res.json())
				})
			})
		})
	}

	create(opt) {
		return new Promise((resolve, reject) => {
			Network.then(net => {
				fetch(`${net.default.url}/bidding/?timestamp=${this.timestamp}`,
				{
					method: 'POST',
					body: JSON.stringify(opt),
				})
				.then(res => {
					resolve(res.json())
				})
			})
		})
	}

	/*create(opt){
		var url=`${Net}/bidding/`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}
	update(opt){
		var url=`${Net}/bidding/`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}
	particulars(opt){
		var url=`${Net}/bidding/particulars/`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}
	requirements(opt){
		var url=`${Net}/bidding/requirements/`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}	*/
}