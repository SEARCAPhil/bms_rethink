import Network from '../../../config/network/network.config.js'

const NetConf = new Network()
const XHR=new window.bms.exports.XHR()

export default class{
	constructor(){}
	lists(options={}){
		let opt=options||{}
		opt.page=opt.page||1
		opt.filter=opt.filter||'all'

		const url=`${NetConf.get()}/bidding/invitations/?status=${opt.filter}&page=${opt.page}&token=${opt.token}`

		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'GET',url:url})

	}
	view(opt = {}){
		return XHR.request({method:'GET',url:`${NetConf.get()}/bidding/invitations/?id=${opt.id}&token=${opt.token}`})	
	}

	search(options={}){
		let opt=options||{}
		opt.page=opt.page||1

		const url=`${NetConf.get()}/bidding/invitations/search.php?param=${opt.param}&${opt.page}&token=${opt.token}`
		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'GET',url:url})

	}
	
	status(opt = {}){
		var url=`${NetConf.get()}/bidding/status.php`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}
	
}