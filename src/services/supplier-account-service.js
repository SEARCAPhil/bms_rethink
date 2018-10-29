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
    return this.__getData(`/suppliers/accounts/?cid=${opt.id}&page=${opt.page}`)
  }
  
  search(opt) {
		return this.__getData(`/suppliers/accounts/?cid=${opt.id}&page=${opt.page}&param=${opt.param}&search=true`)
	}

	view(opt) {
    return this.__getData(`/suppliers/accounts/?id=${opt.id}&token=${opt.token}`)
	}
	
	sessions(opt) {
    return this.__getData(`/suppliers/accounts/sessions.php?id=${opt.id}&token=${opt.token}&page=${opt.page}`)
  }

	activities(opt) {
    return this.__getData(`/suppliers/accounts/logs/?id=${opt.id}&token=${opt.token}&page=${opt.page}`)
	}
	
}