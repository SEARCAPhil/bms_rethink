export default class{
	constructor(){}
	categories(id){

		var url=`http://localhost/bms_api/src/api/suppliers/products/categories/?cid=${id}&sub=true`

		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'GET',url:url})

	}
}