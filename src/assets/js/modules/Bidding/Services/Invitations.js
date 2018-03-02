import Network from '../../../config/network/network.config.js'

const NetConf = new Network()
const XHR=new window.bms.exports.XHR()

export default class{
	constructor(){}

	send(opt){
		var url=`${NetConf.get()}/bidding/requirements/invitation/`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}

}