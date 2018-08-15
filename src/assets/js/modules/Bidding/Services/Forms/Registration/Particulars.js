const Net = window.bms.config.network
const XHR=new window.bms.exports.XHR()

export default class {
	contructor(){}
	create(opt){
		var url=`${Net}/bidding/particulars`
		return XHR.request({method:'POST',url:url,body:JSON.stringify(opt)})
	}	
}