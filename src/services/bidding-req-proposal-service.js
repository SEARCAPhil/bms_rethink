const Network =  import('../config/api') 
const XHR = import('../utils/xhr')

export default class{
	constructor(){
		this.timestamp = new Date().getTime()
	}

	__postData(url, body) {
		return new Promise((resolve, reject) => {
			Network.then(net => {
				fetch(`${net.default.url}${url}`,
				{
					method: 'POST',
					body: JSON.stringify(body),
				})
				.then(res => {
					resolve(res.json())
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
	
	lists(opt) {
    return this.__getData(`/bidding/proposals/?id=${opt.id}&status=${opt.filter}&page=${opt.page}&token=${opt.token}&timestamp=${this.timestamp}`)
  }

  view(opt) {
    return this.__getData(`/bidding/proposals/?id=${opt.id}&token=${opt.token}&timestamp=${this.timestamp}`)
  }
  
}