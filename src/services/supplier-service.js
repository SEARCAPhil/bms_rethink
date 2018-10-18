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
					body: isJSON ? JSON.stringify(body) : body,
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
  
  list(opt) {
    return this.__getData(`/suppliers/?status=${opt.filter}&page=${opt.page}`)
	}

	create(payload) {
    return this.__postData(`/suppliers/`, payload, false)
	}
	
	stat(opt) {
    return this.__getData(`/suppliers/status.php`)
	}
	
	view(opt) {
    return this.__getData(`/suppliers/?id=${opt.id}&token=${opt.token}`)
	}
	
	search(opt) {
		return this.__getData(`/suppliers/?&page=${opt.page}&param=${opt.param}&search=true`)
	}

	remove(opt) {
		return this.__postData(`/suppliers/?timestamp=${this.timestamp}`, opt)
	}

}