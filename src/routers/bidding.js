const Navigo = import('navigo')
const DisplayStyler = import('../utils/display-styler')
const ScriptLoader = import('../utils/script-loader')
const DropdownLoader = import('../utils/dropdown-loader/index')
const Menuselector = import('../utils/menu-selector')
const ListSection = import('../components/list-section')
const InitSection = import('../pages/initial-section')
const BiddingServ = import('../services/bidding-list-service')
const ListItem = import('../components/list-item')

/**
 * Load List section
 */
const loadListSection = () => { 
  return new Promise((resolve, reject) => {
    ListSection.then(sec => {
      const lSec = document.querySelector('list-section') || document.querySelector('.list-bids-container')
      if (!lSec) return 0
      // list section
      const newLSec = document.createElement('article')
      newLSec.classList.add('list-bids-container', 'col', 'col-lg-2', 'col-md-3', 'd-none', 'd-lg-block')
      newLSec.innerHTML = sec.default
      lSec.replaceWith(newLSec)
      // dropdown
      DropdownLoader.then(loader =>  loader.default('device-dropdown'))
      // resolve
      resolve()
    })
  }).catch(err => {
    reject(err)
  })
}

/**
 * Bidding List AJAX
 */
const getBiddingList = (opt = {}) => { 
  // load Via AJAX
  const listSection = document.querySelector('.list-bidding-section')
    BiddingServ.then(loader => { 
      const a = new loader.default()
      a.lists({ token : window.localStorage.getItem('token'), filter: opt.filter || 'all' }).then(res => {

        // clear section for page 1
        if(opt.page < 2) listSection.innerHTML = ''

        // items
        ListItem.then(item => {

          // items
          res.forEach((el, index) => {
            const lItem = new item.default({class: 'col-12 list', id: el.id, profile_name: el.profile_name, date_created: el.date_created})
            listSection.append(lItem)
          })

        })
      })
    })
}

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
      console.log('bidding')
    }
  }).resolve()

  
  appRoute2.on({
    '' : () => { },
    '/bids/all' : () => {
        Menuselector.then(loader => { new loader.default().active('bids-menu-list-all') })
        InitSection.then(res => document.querySelector('initial-section') ? document.querySelector('initial-section').replaceWith(res.default) : 0)
        // get bidding
        loadListSection().then(() => {
          getBiddingList()
        })
     },
    '/bids/drafts' : () => { 

        Menuselector.then(loader => { new loader.default().active('bids-menu-list-drafts') })
        // get bidding
        loadListSection().then(() => {
          getBiddingList({filter: 'drafts', page: 1})
        })
    },
    '/bids/:id/info/': (params) => {
      // load list on page refresh or later
      if (!document.querySelector('.list-bids-container')) {
        Menuselector.then(loader => { new loader.default().active('bids-menu-list-all') })
        loadListSection().then(() => {
          getBiddingList()
        })
      }
    }
  }).resolve()
})