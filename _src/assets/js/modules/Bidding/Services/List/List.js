const Net = window.bms.config.network
const XHR = new window.bms.exports.XHR()

export default class{
	constructor(){
		this.timestamp = new Date().getTime()
	}
	

	search(opt = {}){
		const url=`${Net}/bidding/search.php?param=${opt.param}&page=${opt.page || 1}&token=${opt.token}`
		return XHR.request({method:'GET',url:url})
	}

	view(opt = {}){
		return XHR.request({method:'GET',url:`${Net}/bidding/?id=${opt.id}&token=${opt.token}`})	
	}
	remove(opt = {}){
		var url=`${Net}/bidding/`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}
	status(opt = {}){
		var url=`${Net}/bidding/status.php/?timestamp=${this.timestamp}`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}
	send(opt = {}){
		var url=`${Net}/bidding/collaborators/?timestamp=${this.timestamp}`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}
	signatories(opt = {}){
		var url=`${Net}/bidding/signatories.php/`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}
	removeParticulars(opt = {}){
		var url=`${Net}/bidding/particulars/?timestamp=${this.timestamp}`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}
	removeRequirements(opt = {}){
		var url=`${Net}/bidding/requirements/?timestamp=${this.timestamp}`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}
}