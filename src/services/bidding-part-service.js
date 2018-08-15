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
  
  __getData(url, isJSON = true) {
		return new Promise((resolve, reject) => {
			Network.then(net => {
				fetch(`${net.default.url}${url}`,
				{
					method: 'GET',
				})
				.then(res => {
					return isJSON ? resolve(res.json()) : resolve(res.text())
				})
			})
		})
	}
	
	create(opt) {
    return this.__postData(`/bidding/particulars/?timestamp=${this.timestamp}`, opt)
	}

	remove(opt) {
    return this.__postData(`/bidding/particulars/?timestamp=${this.timestamp}`, opt)
	}
	
	view(opt) {
    return this.__getData(`/bidding/particulars/?timestamp=${this.timestamp}&token=${opt.token}&id=${opt.id}`)
  }
  

}