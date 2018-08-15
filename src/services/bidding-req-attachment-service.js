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
  
  create(opt) {
    return this.__postData(`/bidding/requirements/attachments/?timestamp=${this.timestamp}`, opt)
  }
  
	remove(opt){
		return this.create(opt)
  }
  
	recent(opt) {
    return this.__getData(`/bidding/requirements/attachments/recent/?page=${opt.page || 1 }&token=${opt.token}&timestamp=${this.timestamp}`)
  }

  attach(opt) {
    return this.__postData('/bidding/requirements/attachments/recent/', opt)
  } 
	
}