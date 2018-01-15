export default class{
	constructor(){}
	categories(id){

		var url=`http://localhost/bms_api/src/api/suppliers/products/categories/?cid=${id}&sub=true`

		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'GET',url:url})

	}
	register(opt={}){

		var url=`http://localhost/bms_api/src/api/suppliers/products/categories/`

		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}

		remove(opt={}){

		var url=`http://localhost/bms_api/src/api/suppliers/products/categories/`

		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}

}