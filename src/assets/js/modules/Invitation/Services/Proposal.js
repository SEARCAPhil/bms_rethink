import Network from '../../../config/network/network.config.js'

const NetConf = new Network()
const XHR=new window.bms.exports.XHR()

export default class{
	constructor(){}
	lists(options={}){
		let opt=options||{}
		opt.page=opt.page||1
		opt.filter=opt.filter||'all'

		const url=`${NetConf.get()}/bidding/proposals/?id=${opt.id}&status=${opt.filter}&${opt.page}&token=${opt.token}`

		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'GET',url:url})

	}
	view(opt = {}){
		return XHR.request({method:'GET',url:`${NetConf.get()}/bidding/proposals/?id=${opt.id}&token=${opt.token}`})	
	}
	
	status(opt = {}){
		var url=`${NetConf.get()}/bidding/status.php`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}
	attach(opt){
		const url=`${NetConf.get()}/bidding/requirements/attachments/recent/`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}

	remove(opt = {}){
		const url=`${NetConf.get()}/bidding/proposals/`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}

	send(opt = {}){
		const url=`${NetConf.get()}/bidding/proposals/`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}


	reference(opt = {}){
		const url=`${NetConf.get()}/bidding/proposals/reference.php/`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}
	
}