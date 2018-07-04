import Network from '../../../../config/network/network.config.js'

const NetConf = new Network()


export default class{
	constructor(){}

	lists(id,page=1){

		var url=`${NetConf.get()}/suppliers/accounts/?cid=${id}&page=${page}`

		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'GET',url:url})

	}

	register(opt={}){

		var url=`${NetConf.get()}/suppliers/accounts/`

		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}

	remove(opt={}){

		var url=`${NetConf.get()}/suppliers/accounts/`

		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}

	block(opt={}){

		var url=`${NetConf.get()}/suppliers/accounts/`

		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}

	changePass(opt={}){
		var url=`${NetConf.get()}/suppliers/accounts/`

		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}
}