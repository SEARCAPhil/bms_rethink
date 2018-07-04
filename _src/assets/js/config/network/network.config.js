/**
 * Defines API endpoint
 * 
 * @export
 * @class Network
 */
export default class Network{
	/**
	 * Creates an instance of Network.
	 * @memberof Network
	 */
	constructor(){
		this.config = {
			protocol: 'http',
			host: 'localhost',
			port: null,
			domain:'bms_api/src/api'
		}
	}

	/**
	 * Generate the URL of API
	 * 
	 * @returns {string} 
	 * @memberof Network
	 */
	__generateUrl () {
		return `${this.config.protocol}://${this.config.host}${this.config.port?':this.port':''}/${this.config.domain}`
	}
	
	/**
	 * Generate the URL of API
	 * This calls __generateUrl () function
	 * 
	 * @returns {string}
	 * @memberof Network
	 */
	get () {
		return this.__generateUrl()
	}
}