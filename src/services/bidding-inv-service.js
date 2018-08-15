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
	
	list(opt) {
    return this.__getData(`/bidding/invitations/?status=${opt.filter}&page=${opt.page}&token=${opt.token}`)
	}

	view(opt) {
		return this.__getData(`/bidding/invitations/?id=${opt.id}&token=${opt.token}`)
	}

	search(opt){
		return this.__getData(`/bidding/invitations/search.php?token=${opt.token}&param=${opt.param}&timestamp=${this.timestamp}&page=${opt.page}`)
	}

  
}