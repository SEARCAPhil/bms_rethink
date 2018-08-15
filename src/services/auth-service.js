import sha1 from 'sha1'
const Network =  import('../config/api') 

export default class{
	constructor(){
		this.timestamp = new Date().getTime()
	}

	__postData(url, body) {
		return new Promise((resolve, reject) => {
			Network.then(net => {
				fetch(`${net.default.url}${url}`,
				{
					method: 'POST',
					body: JSON.stringify(body),
				})
				.then(res => {
					resolve(res.json())
				})
			})
		})
	}

	__getData(url) {
		return new Promise((resolve, reject) => {
			Network.then(net => {
				fetch(`${net.default.url}${url}`,
				{
					method: 'GET',
				})
				.then(res => {
					resolve(res.json())
				})
			})
		})
	}


  
  login (username, password) {
    const __payload = {
			username,
			password: sha1(password)
		}
    return this.__postData(`/auth/company.php/`, __payload)	
  }

  store (credential) {
		window.localStorage.setItem('credentials',JSON.stringify(credential))
		window.localStorage.setItem('token', credential.token)
	}

	setCredentials () {
		return window.localStorage.setItem('credentials')	
  }
  
}
	