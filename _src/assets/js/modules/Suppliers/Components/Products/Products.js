import Network from '../../../../config/network/network.config.js'

const NetConf = new Network()

export default class{
	constructor(){}
	lists(options={}){
		var opt=options||{}
		opt.page=opt.page||1


		var url=`${NetConf.get()}/suppliers/products/?cid=${opt.id}&page=${opt.page}`

		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'GET',url:url})

	}

	listPerCategory(options={}){
		var opt=options||{}
		opt.page=opt.page||1


		var url=`${NetConf.get()}/suppliers/products/?cid=${opt.id}&page=${opt.page}&cat=${opt.cat_id}`

		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'GET',url:url})

	}


	register(opt={}){

		var url=`${NetConf.get()}/suppliers/products/`

		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}

	update(opt={}){

		var url=`${NetConf.get()}/suppliers/products/`

		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}

	view(id){

		var url=`${NetConf.get()}/suppliers/products/?id=${id}`

		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'GET',url:url})

	}
	remove(opt={}){

		var url=`${NetConf.get()}/suppliers/products/`

		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}



}