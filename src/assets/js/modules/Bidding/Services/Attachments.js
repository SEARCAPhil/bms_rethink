const Net = window.bms.config.network
const XHR=new window.bms.exports.XHR()

export default class{
	constructor(){}
	recent(opt = {}){
		const url=`${Net}/bidding/attachments/recent/?page=${opt.page || 1}&token=${opt.token}`
		return XHR.request({method:'GET',url:url})

	}

	attach(opt){
		var url=`${Net}/bidding/attachments/recent/`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}

	remove(opt){
		var url=`${Net}/bidding/attachments/`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}

}