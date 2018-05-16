const Net = window.bms.config.network
const XHR = new window.bms.exports.XHR()

export default class{
	constructor(){}
	lists(opt = {}){
		const url=`${NetConf.get()}/accounts/?role=${opt.filter || 'all'}&${opt.page || 1}&token=${opt.token}`
		return XHR.request({method:'GET',url:url})
	}
}