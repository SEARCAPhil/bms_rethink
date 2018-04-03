import Network from '../../../config/network/network.config.js'

const NetConf = new Network()
const XHR=new window.bms.exports.XHR()

export default class{
	constructor(){}
	view(opt = {}){
		return XHR.request({method:'GET',url:`${NetConf.get()}/bidding/particulars/?id=${opt.id}&token=${opt.token}`})	
	}
	
}