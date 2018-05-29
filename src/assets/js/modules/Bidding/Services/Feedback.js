const Net = window.bms.config.network
const XHR = new window.bms.exports.XHR()

export default class{
	constructor(){
		this.timestamp = new Date().getTime()
	}

	get(opt = {}){
		const url = `${Net}/bidding/requirements/feedback.php/?token=${opt.token}&id=${opt.id}&timestamp=${this.timestamp}`
		return XHR.request({method:'GET',url:url})
	}

	getPerBidding(opt = {}){
		const url = `${Net}/bidding/requirements/feedback.php/?token=${opt.token}&id=${opt.id}&timestamp=${this.timestamp}&bidding_request=true`
		return XHR.request({method:'GET',url:url})
	}

	create(opt = {}){
		const url = `${Net}/bidding/requirements/feedback.php/?timestamp=${this.timestamp}`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}
}