import Network from '../../../../../config/network/network.config.js'

const NetConf = new Network()

export default class{
	constructor(){}

	add(opt={}){

		var url=`${NetConf.get()}/suppliers/products/specs/`

		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}

	update(opt={}){

		var url=`${NetConf.get()}/suppliers/products/specs/`

		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}


	remove(opt={}){

		var url=`${NetConf.get()}/suppliers/products/specs/`

		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}

}