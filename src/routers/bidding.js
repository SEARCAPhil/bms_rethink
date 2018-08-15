const Navigo = import('navigo')
const DisplayStyler = import('../utils/display-styler')
const ScriptLoader = import('../utils/script-loader')
const Menuselector = import('../utils/menu-selector')
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
        display.default(['splash-page', '.welcome-section', 'registration-section', '#bids-report-section', '#feedback-section'], 'none')
        display.default(['.list-bids-container'], 'block')
      })
      console.log('bidding')
    }
  }).resolve()

  
  appRoute2.on({
    '' : () => { },
    '/bids/all' : async () => { 
      let ActionsInfo = await import('../pages/bidding-info-section/actions')
      Menuselector.then(loader => { new loader.default().active('bids-menu-list-all') })
      InitSection.then(res => document.querySelector('initial-section') ? document.querySelector('initial-section').replaceWith(res.default) : 0)
      // get bidding
      ActionsInfo.loadListSection().then(() => {
        ActionsInfo.getBiddingList()
      })
     },
    '/bids/drafts' : async () => { 
        let ActionsInfo = await import('../pages/bidding-info-section/actions')
        InitSection.then(res => document.querySelector('initial-section') ? document.querySelector('initial-section').replaceWith(res.default) : 0)
        Menuselector.then(loader => { new loader.default().active('bids-menu-list-drafts') })
        // get bidding
        ActionsInfo.loadListSection().then(() => {
          ActionsInfo.getBiddingList({filter: 'drafts', page: 1})
        })
    },
    '/bids/:id/info/': async (params) => {
      let ActionsInfo = await import('../pages/bidding-info-section/actions')
      // load list on page refresh or later
      if (!document.querySelector('.list-bids-container')) {
        Menuselector.then(loader => { new loader.default().active('bids-menu-list-all') })
        ActionsInfo.loadListSection().then(() => {
          ActionsInfo.getBiddingList()
        })
      }

      // spinner
      import('../components/app-spinner').then(loader => {
        return new loader.default().show({target: '#bidding-info-details'}).then(t => t.template.show())
      })
    
      import('./bidding/info')
    },
    '/bids/forms/registration/*': async (params) => {   
      let ActionsInfo = await import('../pages/bidding-info-section/actions')
      // load list on page refresh or later
      if (!document.querySelector('.list-bids-container')) {
        Menuselector.then(loader => { new loader.default().active('bids-menu-list-all') })
        ActionsInfo.loadListSection().then(() => {
          ActionsInfo.getBiddingList()
        })
      }

      import('./bidding/registration')
    },
    '/bids/requirements/:id':  async (params) => {
      let ActionsInfo = await import('../pages/bidding-info-section/actions')
      // load list on page refresh or later
      if (!document.querySelector('.list-bids-container')) {
        Menuselector.then(loader => { new loader.default().active('bids-menu-list-all') })
        ActionsInfo.loadListSection().then(() => {
          ActionsInfo.getBiddingList()
        })
      }
      import('./bidding/requirements')
    },
    'bids/reports':  (params) => {

      Menuselector.then(loader => { new loader.default().active('bids-menu-list-reports') })
      setTimeout(() => {
        DisplayStyler.then(display => {
          display.default(['.list-bids-container', '#initial-section', '#bids-info-container'], 'none')
          display.default(['#bids-report-section'], 'block')
        })
      },100)

      import('./bidding/reports')

    }
  }).resolve()
})