export default class{
	constructor(){}

	update(opt={}){

		var url=`http://localhost/bms_api/src/api/suppliers/products/prices/`

		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}

}