import Network from '../../../../config/network/network.config.js'

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

		const url=`${NetConf.get()}/bidding/?status=${opt.filter}&${opt.page}&token=${opt.token}`
		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'GET',url:url})

	}

	search(options={}){
		let opt=options||{}
		opt.page=opt.page||1

		const url=`${NetConf.get()}/bidding/search.php?param=${opt.param}&${opt.page}&token=${opt.token}`
		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'GET',url:url})

	}

	view(opt = {}){
		return XHR.request({method:'GET',url:`${NetConf.get()}/bidding/?id=${opt.id}&token=${opt.token}`})	
	}
	remove(opt = {}){
		var url=`${NetConf.get()}/bidding/`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}
	status(opt = {}){
		var url=`${NetConf.get()}/bidding/status.php/?timestamp=${this.timestamp}`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}
	send(opt = {}){
		var url=`${NetConf.get()}/bidding/collaborators/?timestamp=${this.timestamp}`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}
	signatories(opt = {}){
		var url=`${NetConf.get()}/bidding/signatories.php/`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}
	removeParticulars(opt = {}){
		var url=`${NetConf.get()}/bidding/particulars/?timestamp=${this.timestamp}`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}
	removeRequirements(opt = {}){
		var url=`${NetConf.get()}/bidding/requirements/?timestamp=${this.timestamp}`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}
}