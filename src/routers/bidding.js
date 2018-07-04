const Navigo = import('navigo')
const DisplayStyler = import('../utils/display-styler')
const ScriptLoader = import('../utils/script-loader')
const DropdownLoader = import('../utils/dropdown-loader/index')
const Menuselector = import('../utils/menu-selector')
const ListSection = import('../components/list-section')
const InitSection = import('../pages/initial-section')


Navigo.then((Navigo) => {
  // Navigo instance
  const appRoute = new Navigo.default('http://localhost/bms_rethink/www/',  true)
  const appRoute2 = new Navigo.default('http://localhost/bms_rethink/www/',  true)

  appRoute.on({
    '' : () => { },
    '/bids/*' : () => {
      // change visibility
      DisplayStyler.then(display => {
        display.default(['splash-page', '.welcome-section'], 'none')
        display.default(['.list-bids-container'], 'block')
      })

      // list section
      ListSection.then(sec => {
        const lSec = document.querySelector('list-section')
        if (!lSec) return 0
        // list section
        const newLSec = document.createElement('article')
        newLSec.classList.add('list-bids-container', 'col', 'col-lg-2', 'col-md-3', 'd-none', 'd-lg-block')
        newLSec.innerHTML = sec.default
        lSec.replaceWith(newLSec)

        // dropdown
        DropdownLoader.then(loader =>  loader.default('device-dropdown'))
      })

      console.log('bidding')

    }
  }).resolve()

  
  appRoute2.on({
    '' : () => { },
    '/bids/all' : () => {
        Menuselector.then(loader => loader.default('bids-menu-list-all'))
        InitSection.then(res => document.querySelector('initial-section').replaceWith(res.default))
     },
    '/bids/drafts' : () => {
        Menuselector.then(loader => loader.default('bids-menu-list-drafts'))
    }
  }).resolve()
})