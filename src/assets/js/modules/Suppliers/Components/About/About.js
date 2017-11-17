export default class{
	constructor(){}
	about(id){

		var url=`http://localhost/bms_api/src/api/suppliers/?id=${id}`

		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'GET',url:url})

	}
}