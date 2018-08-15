const Net = window.bms.config.network
const XHR = new window.bms.exports.XHR()

export default class{
	constructor(){}
	lists(options={}){
		let opt=options||{}
		opt.page=opt.page||1
		opt.filter=opt.filter||'all'

		const url=`${Net}/bidding/invitations/?status=${opt.filter}&page=${opt.page}&token=${opt.token}`

		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'GET',url:url})

	}
	view(opt = {}){
		return XHR.request({method:'GET',url:`${Net}/bidding/invitations/?id=${opt.id}&token=${opt.token}`})	
	}

	search(options={}){
		let opt=options||{}
		opt.page=opt.page||1

		const url=`${Net}/bidding/invitations/search.php?param=${opt.param}&${opt.page}&token=${opt.token}`
		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'GET',url:url})

	}
	
	status(opt = {}){
		var url=`${Net}/bidding/status.php`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}
	
}