import Network from '../../../config/network/network.config.js'

const NetConf = new Network()
const XHR=new window.bms.exports.XHR()

export default class{
	constructor(){
		this.timestamp = new Date().getTime()
	}
	recent(options={}){
		let opt=options||{}
		opt.page=opt.page||1
		opt.filter=opt.filter||'all'

		const url=`${NetConf.get()}/bidding/requirements/attachments/recent/?page=${opt.page}&token=${opt.token}&timestamp=${this.timestamp}`
		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'GET',url:url})

	}

	view(opt = {}){
		return XHR.request({method:'GET',url:`${NetConf.get()}/bidding/requirements/?id=${opt.id}&token=${opt.token}&timestamp=${this.timestamp}`})	
	}
	
	attach(opt){
		const url=`${NetConf.get()}/bidding/requirements/attachments/recent/?timestamp=${this.timestamp}`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}

	remove(opt = {}){
		const url=`${NetConf.get()}/bidding/requirements/attachments/?timestamp=${this.timestamp}`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}

	send(opt = {}){
		const url=`${NetConf.get()}/bidding/requirements/recepients/?timestamp=${this.timestamp}`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}

	deadline(opt = {}){
		const url=`${NetConf.get()}/bidding/requirements/deadline.php/?timestamp=${this.timestamp}`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}

	removeRecepients(opt = {}){
		const url=`${NetConf.get()}/bidding/requirements/recepients/?timestamp=${this.timestamp}`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}
}