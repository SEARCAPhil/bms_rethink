const Net = window.bms.config.network
const XHR = new window.bms.exports.XHR()

export default class{
	constructor(){}
	biddingSummary(opt = {}){
		return XHR.request({method:'GET', url: `${Net}/bidding/reports/summary.php?from=${opt.from}&to=${opt.to}&token=${opt.token}`})
	}
}