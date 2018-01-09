export default class{
	constructor(){}
	lists(id,page=1){

		var url=`http://localhost/bms_api/src/api/suppliers/logs/?id=${id}&page=${page}`

		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'GET',url:url})

	}
}