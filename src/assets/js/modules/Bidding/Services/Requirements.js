const Net = window.bms.config.network
const XHR=new window.bms.exports.XHR()
/**
 * Manage resources in the server through API
 * 
 * @module Bidding\Services
 */
export default class{
	constructor(){
		this.timestamp = new Date().getTime()
	}
	/**
	 * Get recent attachments under a particular item
	 * 
	 * @param {Object} [opt = {}]
	 * @param {number} [opt.page = 1]
	 * @param {number} opt.token
	 * @returns HMLHttpRequest
	 */
	recent(opt = {}){
		const url=`${Net}/bidding/requirements/attachments/recent/?page=${opt.page || 1 }&token=${opt.token}&timestamp=${this.timestamp}`
		return XHR.request({method:'GET',url:url})
	}

	view(opt = {}){
		return XHR.request({method:'GET',url:`${Net}/bidding/requirements/?id=${opt.id}&token=${opt.token}&timestamp=${this.timestamp}`})	
	}
	
	attach(opt){
		const url=`${Net}/bidding/requirements/attachments/recent/?timestamp=${this.timestamp}`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}

	remove(opt = {}){
		const url=`${Net}/bidding/requirements/attachments/?timestamp=${this.timestamp}`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}

	send(opt = {}){
		const url=`${Net}/bidding/requirements/recepients/?timestamp=${this.timestamp}`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}

	deadline(opt = {}){
		const url=`${Net}/bidding/requirements/deadline.php/?timestamp=${this.timestamp}`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}

	removeRecepients(opt = {}){
		const url=`${Net}/bidding/requirements/recepients/?timestamp=${this.timestamp}`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}
}