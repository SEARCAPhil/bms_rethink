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
	
	view(opt) {
    return this.__getData(`/bidding/requirements/?id=${opt.id}&token=${opt.token}&timestamp=${this.timestamp}`)
	}
	
	deadline(opt) {
		return this.__postData(`/bidding/requirements/deadline.php/?timestamp=${this.timestamp}`, opt)
	}

	invite(opt) {
		return this.__postData(`/bidding/requirements/recepients/?timestamp=${this.timestamp}`, opt)
	}

	winner(opt) {
		return this.invite(opt)
	}

	award(opt) {
		return this.invite(opt)
	}

	sendFeedbackToAwardee(opt){
		return this.__postData(`/bidding/requirements/feedback.php/?timestamp=${this.timestamp}`, opt)
	}

	getFeedbackAwardee(opt) {
		return this.__getData(`/bidding/requirements/feedback.php/?token=${opt.token}&id=${opt.id}&timestamp=${this.timestamp}`)
	}
  
}