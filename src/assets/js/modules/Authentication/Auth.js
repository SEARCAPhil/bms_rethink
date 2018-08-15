
export default class {
	constructor () {
		this.xhr = new window.bms.exports.XHR()
		this.config = window.bms.config.network
	}
	info (username) {
		this.username = username
		this.xhr.request({ url: `${this.config}/test` }).then((e) => {
			this.profile = e
		}).catch((error) => {
			this.authError = error
		})
	}
	login (username, password) {

		let data = {
			username,
			password: window.sha1(password)
		}
		
		return this.xhr.request({ url: `${this.config}/auth/company.php/`, method: 'POST', body:JSON.stringify(data) })
	}
	store (credential) {
		window.localStorage.setItem('credentials',JSON.stringify(credential))
		window.localStorage.setItem('token',credential.token)
	}

	getCredentials () {
		return window.localStorage.setItem('credentials')	
	}
}