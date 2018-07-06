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
}