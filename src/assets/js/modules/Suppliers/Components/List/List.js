import Network from '../../../../config/network/network.config.js'

const NetConf = new Network()



export default class{
	constructor(){}
	getList(options={}){
		var opt=options||{}
		opt.page=opt.page||1
		opt.filter=opt.filter||'all'

		var url=`${NetConf.get()}/suppliers/?status=${opt.filter}&page=${opt.page}`

		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'GET',url:url})

	}

	search(options={}){
		var opt=options||{}
		opt.page=opt.page||1

		var url=`${NetConf.get()}/suppliers/?&page=${opt.page}&param=${opt.param}&search=true`

		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'GET',url:url})

	}

	block(id){
		//MUST use PUT request
		//however, because we are testing it through localhost, DELETE and PUT request
		//is prohibited and we will receive a preflight error response. To be able to test it locally
		//the developer decided to use POST BUT the data contains an action field equivalent with a value of 'remove'
		// Thus, the API will also rely on the action field to determine wether it will add or remove content in the database
		var url=`${NetConf.get()}/suppliers/`

		//require exports.js
		const XHR=new window.bms.exports.XHR()
		let data={
			id:id,
			action:'block'
		}
		
		return XHR.request({method:'POST',url:url,body:JSON.stringify(data)})
	}

	unblock(id){
		//MUST use DELETE request
		//however, because we are testing it through localhost, DELETE and PUT request
		//is prohibited and we will receive a preflight error response. To be able to test it locally
		//the developer decided to use POST BUT the data contains an action field equivalent with a value of 'remove'
		// Thus, the API will also rely on the action field to determine wether it will add or remove content in the database
		var url=`${NetConf.get()}/suppliers/`

		//require exports.js
		const XHR=new window.bms.exports.XHR()
		let data={
			id:id,
			action:'unblock'
		}

		return XHR.request({method:'POST',url:url,body:JSON.stringify(data)})
	}

	remove(id){
		//MUST use DELETE request
		//however, because we are testing it through localhost, DELETE and PUT request
		//is prohibited and we will receive a preflight error response. To be able to test it locally
		//the developer decided to use POST BUT the data contains an action field equivalent with a value of 'remove'
		// Thus, the API will also rely on the action field to determine wether it will add or remove content in the database
		var url=`${NetConf.get()}/suppliers/`

		//require exports.js
		const XHR=new window.bms.exports.XHR()
		let data={
			id:id,
			action:'remove'
		}

		return XHR.request({method:'POST',url:url,body:JSON.stringify(data)})
	}
}