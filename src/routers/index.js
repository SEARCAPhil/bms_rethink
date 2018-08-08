const Navigo = import('navigo')
const DisplayStyler = import('../utils/display-styler')
const ScriptLoader = import('../utils/script-loader')
const DropdownLoader = import('../utils/dropdown-loader/')
const Menuselector = import('../utils/menu-selector')

/**
 * Header
 */
const loadHeader = () => {
  const MainHeader = import('../components/main-header')
  const ProfileLoader = import('../utils/profile-loader') 
  // header
  return MainHeader.then(res => {
    const headerSec =  document.querySelector('header')
    headerSec.innerHTML = res.default
    // load MSAL
    ScriptLoader.then(loader => loader.default(headerSec))
    // load profile
    ProfileLoader.then(loader => { loader.default() })
    // change visibility
    DisplayStyler.then(display => {
      display.default(['splash-page', '.list-bids-container'],'none')
    })
  })
}


/**
 * Left Sidebar
 */
const loadLeftSidebar = (activeMenuID) => {
  const Lsidebar = import('../components/left-sidebar') 
  // header
  return Lsidebar.then(res => {
    const lSec =  document.querySelector('left-sidebar')
    if (!lSec) return 0
    // sidebar's content
    const aside = document.createElement('aside')
    aside.classList.add('col', 'col-lg-2', 'col-md-3', 'col-xs-12', 'd-none', 'd-lg-block')
    aside.innerHTML = res.default
    aside.setAttribute('style', 'background:rgba(0,0,0,0.8);min-width:100px;')
    lSec.replaceWith(aside)
    // load MSAL
    ScriptLoader.then(loader => loader.default(aside))
  })
}

/**
 * Welcome page
 */
const loadWelcome = () => {
  const HomePage = import('../pages/home-section') 

  HomePage.then(res => {
    const wSec = document.querySelector('.welcome-section')
    // load page
    wSec.innerHTML = res.default
    // load scripts
    ScriptLoader.then(loader => loader.default(wSec))
    // change visibility
    DisplayStyler.then(display => {
      display.default(['.welcome-section'],'block')
    })
  })
}


Navigo.then((Navigo) => {
  // Navigo instance
  const appRoute = new Navigo.default('http://localhost/bms_rethink/www/',  true)

  appRoute.on({
    '' : () =>{
      // redirect to home by default
      window.location.hash = '/home'
    },
    '/auth' :  () =>  {
      // redirect to o365 authentication page
      window.location = 'auth.html'
    },
    '/home' : () => {
      // detect login instance
      if (!window.localStorage.getItem('role')) {
        window.location.hash = '#/logout'
      }
      // load components
      loadHeader()
      loadLeftSidebar().then(() => {
        Menuselector.then(loader => { new loader.default().active('home_menu') })
      })
      loadWelcome()
      // dropdown
      DropdownLoader.then(loader =>  loader.default('device-dropdown'))
    },
    '/bids/*': () => {
      // load components
      loadHeader()
      loadLeftSidebar().then(() => {
        import('./bidding')
      })
      // dropdown
      DropdownLoader.then(loader => loader.default('device-dropdown'))

      
    },
   	'/inv/*':()=>{
      // load components
      loadHeader()
      loadLeftSidebar().then(() => {
        Menuselector.then(loader => { new loader.default().active('inv-menu-list') })
        import('./invitation')
      })
      // dropdown
      DropdownLoader.then(loader => loader.default('device-dropdown'))
     },
     'feedback/*': () => {
        loadHeader()
        loadLeftSidebar().then(() => {
          Menuselector.then(loader => { new loader.default().active('feedback-menu-list') })
          import('./feedback')
        })
     },
    '/logout/' : () => { 
      return (localStorage.getItem('role') === 'supplier') ? (window.location = `${window.location.origin}${window.location.pathname}cauth.html`) : window.location.hash = '/auth'
      
    },
  }).resolve()
})