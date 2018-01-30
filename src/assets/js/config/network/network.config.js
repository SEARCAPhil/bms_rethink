
export default class Network{
	constructor(){
		this.config = {
			protocol: 'http',
			host: 'localhost',
			port: null,
			domain:'bms_api/src/api'
		}
	}
	__generateUrl(){
		return `${this.config.protocol}://${this.config.host}${this.config.port?':this.port':''}/${this.config.domain}`
	}

	get(){
		return this.__generateUrl()
	}
}