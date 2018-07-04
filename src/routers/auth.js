const Navigo = import('navigo')
const DisplayStyler = import('../utils/display-styler')
const ScriptLoader = import('../utils/script-loader')
const AuthSection = import('../pages/auth-section')


DisplayStyler.then(display => {
  // change visibility
  display.default(['auth-section'],'block')
  
  // load template
  AuthSection.then(auth => {
    const authSec =  document.querySelector('auth-section')
    authSec.innerHTML = auth.default
    // load MSAL
    ScriptLoader.then(loader => loader.default(authSec))
  })
})
    
