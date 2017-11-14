export default class{
	constructor(){}
	getList(options={}){
		var opt=options||{}
		opt.page=opt.page||1
		opt.filter=opt.filter||'all'

		var url=`http://localhost/bms_api/src/api/suppliers/?status=${opt.filter}&${opt.page}`

		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'GET',url:url})

	}
}