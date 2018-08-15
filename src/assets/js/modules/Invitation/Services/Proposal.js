import Network from '../../../config/network/network.config.js'

const NetConf = new Network()
const XHR=new window.bms.exports.XHR()

export default class{
	constructor(){
		this.timestamp = new Date().getTime()
	}
	lists(options={}){
		let opt=options||{}
		opt.page=opt.page||1
		opt.filter=opt.filter||'all'

		const url=`${NetConf.get()}/bidding/proposals/?id=${opt.id}&status=${opt.filter}&${opt.page}&token=${opt.token}&timestamp=${this.timestamp}`

		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'GET',url:url})

	}
	view(opt = {}){
		return XHR.request({method:'GET',url:`${NetConf.get()}/bidding/proposals/?id=${opt.id}&token=${opt.token}&timestamp=${this.timestamp}`})	
	}
	
	status(opt = {}){
		var url=`${NetConf.get()}/bidding/status.php?timestamp=${this.timestamp}`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}
	attach(opt){
		const url=`${NetConf.get()}/bidding/requirements/attachments/recent/?timestamp=${this.timestamp}`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}

	remove(opt = {}){
		const url=`${NetConf.get()}/bidding/proposals/?timestamp=${this.timestamp}`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}

	send(opt = {}){
		const url=`${NetConf.get()}/bidding/proposals/?timestamp=${this.timestamp}`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}


	reference(opt = {}){
		const url=`${NetConf.get()}/bidding/proposals/reference.php/?timestamp=${this.timestamp}`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}
	
}