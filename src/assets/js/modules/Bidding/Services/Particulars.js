const Net = window.bms.config.network
const XHR = new window.bms.exports.XHR()

export default class{
	constructor(){}
	view(opt = {}){
		return XHR.request({method:'GET',url:`${Net}/bidding/particulars/?id=${opt.id}&token=${opt.token}`})	
	}
}