const Navigo = import('navigo')
const DisplayStyler = import('../utils/display-styler')
const ScriptLoader = import('../utils/script-loader')

const loadCompanyAuth = () => {
  import('../pages/auth-company-section').then(auth => {
    const authSec =  document.querySelector('auth-section')
    authSec.innerHTML = auth.default
    // load MSAL
    ScriptLoader.then(loader => loader.default(authSec))
  })
}

const loadO365Sec = () => {
  // load template
  import('../pages/auth-section').then(auth => {
    const authSec =  document.querySelector('auth-section')
    authSec.innerHTML = auth.default
    // load MSAL
    ScriptLoader.then(loader => loader.default(authSec))
  })
}

DisplayStyler.then(display => {
  // change visibility
  display.default(['auth-section'],'block')
  const ASec = document.querySelector('auth-section')
  
  if(ASec.getAttribute('section') != 'company') {
    loadO365Sec()
  } else {
    loadCompanyAuth()
  }
})
    
