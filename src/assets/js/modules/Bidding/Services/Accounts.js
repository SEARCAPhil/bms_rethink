import Network from '../../../config/network/network.config.js'

const NetConf = new Network()
const XHR=new window.bms.exports.XHR()

export default class{
	constructor(){}
	lists(options={}){
		let opt=options||{}
		opt.page=opt.page||1
		opt.filter=opt.filter||'all'

		const url=`${NetConf.get()}/accounts/?role=${opt.filter}&${opt.page}&token=${opt.token}`
		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'GET',url:url})

	}
}