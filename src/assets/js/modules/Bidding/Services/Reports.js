import Network from '../../../config/network/network.config.js'

const NetConf = new Network()
const XHR=new window.bms.exports.XHR()

export default class{
	constructor(){}
	biddingSummary(opt={}){
		return XHR.request({method:'GET', url: `${NetConf.get()}/bidding/reports/summary.php?from=${opt.from}&to=${opt.to}&token=${opt.token}`})
	}
}