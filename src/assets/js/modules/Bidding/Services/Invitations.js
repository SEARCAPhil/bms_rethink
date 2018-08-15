const Net = window.bms.config.network
const XHR = new window.bms.exports.XHR()

export default class{
	constructor(){
		this.timestamp = new Date().getTime()
	}

	send(opt = {}){
		var url=`${Net}/bidding/requirements/invitation/?timestamp=${this.timestamp}`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}

}