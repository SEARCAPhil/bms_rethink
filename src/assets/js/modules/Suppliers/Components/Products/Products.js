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


}