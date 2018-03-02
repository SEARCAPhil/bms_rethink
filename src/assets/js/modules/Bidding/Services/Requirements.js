import Network from '../../../config/network/network.config.js'

const NetConf = new Network()
const XHR=new window.bms.exports.XHR()

export default class{
	constructor(){}
	recent(options={}){
		let opt=options||{}
		opt.page=opt.page||1
		opt.filter=opt.filter||'all'

		const url=`${NetConf.get()}/bidding/requirements/attachments/recent/?page=${opt.page}`
		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'GET',url:url})

	}

	attach(opt){
		var url=`${NetConf.get()}/bidding/requirements/attachments/recent/`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}

}