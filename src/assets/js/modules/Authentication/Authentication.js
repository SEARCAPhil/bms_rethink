import Authentication from './Util/Email/OrgChecker'
import Auths from './Auth'

/* function auth call */
const auth = new Auths()
const usernameField = document.getElementById('username')
const passwordField = document.getElementById('password')
const loginBtn = document.getElementById('loginBtn')
const loginForm = document.querySelector('form[name="login"]')
const loginStatus = document.getElementById('auth-status')

// loading status
window.bms.default.spinner = new window.bms.exports.Spinner({
    target:'body',
    class:'spinner'
})

const showLoginError = () => {
	loginStatus.innerHTML ='<div class="col-lg-12 text-danger text-center auth-error-section">Invalid username or password<br/>Please try again later<br/><div>'
	// hide loading
	window.bms.default.spinner.hide()
	loginBtn.removeAttribute('disabled')
}

const login = (e) => {
	e.preventDefault()

	// non empty value
	if (usernameField.value.length > 0 && passwordField.value.length > 0) {
		// loading
		window.bms.default.spinner.show()
		// disable
		loginBtn.setAttribute('disabled', 'disabled')
		// login
		auth.login(usernameField.value,passwordField.value).then(data => {
			let json = JSON.parse(data)

			if (json.token){
				// account not yet verified
                if (!json.role) {
                    window.location = 'confirmation.html'
                    return 0
                }
                
                window.bms.default.spinner.hide()

                localStorage.setItem('token', json.token)
                localStorage.setItem('role', json.role)
                window.localStorage.setItem('id', json.id)
                window.localStorage.setItem('givenName', usernameField.value)

                window.location = '../../#/home/'
			}else{
				showLoginError()
			}

		}).catch((err) => {
			console.log(err)
			showLoginError()
		})	
	}
	
}






const  listenOnUsernameChange = (e) => { 
	var el=document.getElementById('organization');
	if(el.value.length<1) return false
		

	//redirect to o365 Oauth page
	var isSearca=Auth.checkCorporateEmailAddress({domain:'searca',email:el.value})
	if(isSearca){
	 	this.setAttribute('disabled','disabled')
		setTimeout(()=>{window.location=window.location.href.substr(0,window.location.href.lastIndexOf('/'))+'/o365.html'},600)
	}

	//show login form
	if(!isSearca){
		document.querySelector('.auth-org').style.display='none'
		document.querySelector('.auth-default').style.display='block'	
	}
}


window.addEventListener('DOMContentLoaded',()=>{
	loginForm.addEventListener('submit', login)
	//document.querySelector('#loginOrgButton').addEventListener('click',listenOnUsernameChange,false)

})