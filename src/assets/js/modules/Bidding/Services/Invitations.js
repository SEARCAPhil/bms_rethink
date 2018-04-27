import Network from '../../../config/network/network.config.js'

const NetConf = new Network()
const XHR=new window.bms.exports.XHR()

export default class{
	constructor(){
		this.timestamp = new Date().getTime()
	}

	send(opt){
		var url=`${NetConf.get()}/bidding/requirements/invitation/?timestamp=${this.timestamp}`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}

}