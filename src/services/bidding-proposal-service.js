const Network =  import('../config/api') 
const XHR = import('../utils/xhr')

export default class{
	constructor(){
		this.timestamp = new Date().getTime()
	}

	__postData(url, body, isJSON = true) {
		return new Promise((resolve, reject) => {
			Network.then(net => {
				fetch(`${net.default.url}${url}`,
				{
					method: 'POST',
					body: JSON.stringify(body),
				})
				.then(res => {
					return isJSON ? resolve(res.json()) : resolve(res.text())
				})
			})
		})
  }
  
  __getData(url) {
		return new Promise((resolve, reject) => {
			Network.then(net => {
				fetch(`${net.default.url}${url}`,
				{
					method: 'GET',
				})
				.then(res => {
					resolve(res.json())
				})
			})
		})
	}
	
	create(opt) {
    return this.__postData(`/bidding/proposals/?timestamp=${this.timestamp}`, opt)
	}

	view(opt) {
		return this.__getData(`/bidding/proposals/?id=${opt.id}&token=${opt.token}&timestamp=${this.timestamp}`)
	}

	remove(opt) {
		return this.__postData(`/bidding/proposals/?timestamp=${this.timestamp}`, opt, false)
	}

	/*
	
	status(opt = {}){
		var url=`${NetConf.get()}/bidding/status.php?timestamp=${this.timestamp}`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}
	attach(opt){
		const url=`${NetConf.get()}/bidding/requirements/attachments/recent/?timestamp=${this.timestamp}`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}

	remove(opt = {}){
		const url=`${NetConf.get()}/bidding/proposals/?timestamp=${this.timestamp}`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}

	send(opt = {}){
		const url=`${NetConf.get()}/bidding/proposals/?timestamp=${this.timestamp}`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}


	reference(opt = {}){
		const url=`${NetConf.get()}/bidding/proposals/reference.php/?timestamp=${this.timestamp}`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}*/
  

}