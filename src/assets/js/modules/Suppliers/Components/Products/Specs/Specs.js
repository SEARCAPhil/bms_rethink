export default class{
	constructor(){}

	add(opt={}){

		var url=`http://localhost/bms_api/src/api/suppliers/products/specs/`

		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}

	update(opt={}){

		var url=`http://localhost/bms_api/src/api/suppliers/products/specs/`

		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}


	remove(opt={}){

		var url=`http://localhost/bms_api/src/api/suppliers/products/specs/`

		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}

}