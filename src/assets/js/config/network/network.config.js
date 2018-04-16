
export default class Network{
	constructor(){
		this.config = {
			protocol: 'http',
			host: 'searcabackup.org',
			port: null,
			domain:'bms/bms_api/src/api'
		}
	}
	__generateUrl(){
		return `${this.config.protocol}://${this.config.host}${this.config.port?':this.port':''}/${this.config.domain}`
	}

	get(){
		return this.__generateUrl()
	}
}