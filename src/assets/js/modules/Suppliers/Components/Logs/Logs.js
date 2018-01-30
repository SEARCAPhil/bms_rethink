import Network from '../../../../config/network/network.config.js'

const NetConf = new Network()

export default class{
	constructor(){}
	lists(id,page=1){

		var url=`${NetConf.get()}/suppliers/logs/?id=${id}&page=${page}`

		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'GET',url:url})

	}
}