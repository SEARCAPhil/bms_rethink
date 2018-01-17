export default class{
	constructor(){}
	lists(options={}){
		var opt=options||{}
		opt.page=opt.page||1


		var url=`http://localhost/bms_api/src/api/suppliers/products/?cid=${opt.id}&page=${opt.page}`

		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'GET',url:url})

	}

	register(opt={}){

		var url=`http://localhost/bms_api/src/api/suppliers/products/`

		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}

	view(id){

		var url=`http://localhost/bms_api/src/api/suppliers/products/?id=${id}`

		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'GET',url:url})

	}
	remove(opt={}){

		var url=`http://localhost/bms_api/src/api/suppliers/products/`

		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}



}