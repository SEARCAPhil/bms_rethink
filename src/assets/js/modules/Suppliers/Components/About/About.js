import Network from '../../../../config/network/network.config.js'

const NetConf = new Network()

export default class{
	constructor(){}
	about(id){

		var url=`${NetConf.get()}/suppliers/?id=${id}`

		//require exports.js
		const XHR=new window.bms.exports.XHR()

		return XHR.request({method:'GET',url:url})

	}
}