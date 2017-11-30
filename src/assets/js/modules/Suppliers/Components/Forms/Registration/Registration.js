export default class{
	constructor(){}
	register(opt={}){

		var url=`http://localhost/bms_api/src/api/suppliers/`

		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}
}