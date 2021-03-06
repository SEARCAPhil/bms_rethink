import Network from '../../../config/network/network.config.js'

const NetConf = new Network()
const XHR=new window.bms.exports.XHR()

export default class{
	constructor(){}

	attach(opt){
		var url=`${NetConf.get()}/bidding/invitations/attachments/`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}

	remove(opt = {}){
		var url=`${NetConf.get()}/bidding/invitations/attachments/`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}
}