import Network from '../../../../../config/network/network.config.js'

const NetConf = new Network()

export default class{
	constructor(){}
	categories(id){

		var url=`${NetConf.get()}/suppliers/products/categories/?cid=${id}&sub=true`

		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'GET',url:url})

	}

	view(id){

		var url=`${NetConf.get()}/suppliers/products/categories/?id=${id}`

		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'GET',url:url})

	}

	register(opt={}){

		var url=`${NetConf.get()}/suppliers/products/categories/`

		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}

	remove(opt={}){

		var url=`${NetConf.get()}/suppliers/products/categories/`

		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}


	update(opt={}){

		var url=`${NetConf.get()}/api/suppliers/products/categories/`

		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}

}