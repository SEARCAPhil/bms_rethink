const Checker = import('../../utils/tenant-checker')
const Auth = import('../../services/auth-service')


/* function auth call */
//const auth = new Auths()
const usernameField = document.getElementById('username')
const passwordField = document.getElementById('password')
const loginBtn = document.getElementById('loginBtn')
const loginForm = document.querySelector('form[name="login"]')
const loginStatus = document.getElementById('auth-status')

const showLoginError = () => {
	loginStatus.innerHTML ='<div class="col-lg-12 text-danger text-center auth-error-section">Invalid username or password<br/>Please try again later<br/><div>'
	loginBtn.removeAttribute('disabled')
}

const login = (e) => {
  e.preventDefault()
  // non empty value
  if (usernameField.value.length < 1 || passwordField.value.length < 1) return showLoginError()

  // disable
  loginBtn.setAttribute('disabled', 'disabled')

  Auth.then(loader => {
    return new loader.default().login(usernameField.value,passwordField.value).then(json => {

      if (!json.token) return showLoginError()
      // account not yet verified
      if (!json.role) return window.location = 'confirmation.html'
          
      localStorage.setItem('token', json.token)
      localStorage.setItem('role', json.role)
      window.localStorage.setItem('id', json.id)
      window.localStorage.setItem('givenName', usernameField.value)
      localStorage.setItem('username', usernameField.value)

      window.location = window.location.href.substr(0,window.location.href.lastIndexOf('/'))+'/#/home'

      
    }).catch((err) => {
      console.log(err)
      showLoginError()
    })	
  })
    

  
}

const listenOnUsernameChange = (e) => {
  e.preventDefault()
  const __emailField = document.getElementById('organixzation')
  if(__emailField.nodeValue.length < 1) return

  //redirect to auth page
  const isFiltered = Checker.checkCorporateEmailAddress({ domain: 'searca', email: __emailField.value })
  if (isFiltered) {
    this.setAttribute('disabled','disabled')
		setTimeout(()=>{window.location = window.location.href.substr(0,window.location.href.lastIndexOf('/'))+'/auth.html'},600)
  } else {
    document.querySelector('.auth-org').style.display = 'none'
		document.querySelector('.auth-default').style.display = 'block'
  }
}

loginForm.addEventListener('submit', login)