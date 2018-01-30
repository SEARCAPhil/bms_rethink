import Network from '../../../../../config/network/network.config.js'

const NetConf = new Network()

export default class{
	constructor(){}

	update(opt={}){

		var url=`${NetConf.get()}/suppliers/products/prices/`

		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}

}