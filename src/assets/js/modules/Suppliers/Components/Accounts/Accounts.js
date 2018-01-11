export default class{
	constructor(){}

	lists(id,page=1){

		var url=`http://localhost/bms_api/src/api/suppliers/accounts/?cid=${id}&page=${page}`

		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'GET',url:url})

	}

	register(opt={}){

		var url=`http://localhost/bms_api/src/api/suppliers/accounts/`

		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}

	remove(opt={}){

		var url=`http://localhost/bms_api/src/api/suppliers/accounts/`

		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}

	block(opt={}){

		var url=`http://localhost/bms_api/src/api/suppliers/accounts/`

		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}
}