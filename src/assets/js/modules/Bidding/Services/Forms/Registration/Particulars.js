import Network from '../../../../../config/network/network.config.js'
const NetConf = new Network()
const XHR=new window.bms.exports.XHR()

export default class {
	contructor(){}
	create(opt){
		var url=`${NetConf.get()}/bidding/particulars`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}	
}