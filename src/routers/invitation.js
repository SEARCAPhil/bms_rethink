const Navigo = import('navigo')
const DisplayStyler = import('../utils/display-styler')
const ScriptLoader = import('../utils/script-loader')
const Menuselector = import('../utils/menu-selector')
const InitSection = import('../pages/initial-invitation-section')

 
Navigo.then((Navigo) => {
  // Navigo instance
  const appRoute = new Navigo.default('http://localhost/bms_rethink/www/',  true)
  const appRoute2 = new Navigo.default('http://localhost/bms_rethink/www/',  true)

  appRoute.on({
    '' : () => { },
    '/inv/*' : () => {
      // change visibility
      DisplayStyler.then(display => {
        display.default(['splash-page', '.welcome-section', 'registration-section'], 'none')
        display.default(['.list-bids-container'], 'block')
      })
      console.log('invitation')
    }
  }).resolve()

  
  appRoute2.on({
    '' : () => { },
    '/inv/all' : async () => { 
      let ActionsInfo = await import('../pages/invitation-section/actions')
      Menuselector.then(loader => { new loader.default().active('inv-menu-list') })
      InitSection.then(res => document.querySelector('initial-section') ? document.querySelector('initial-section').replaceWith(res.default) : 0)
      // get bidding
      ActionsInfo.loadListSection().then(() => {
        document.querySelector('.filter-dropdown').remove()
        ActionsInfo.list()
      })
     },
    '/inv/:id/info/': async (params) => {
      // load list on page refresh or later
      if (!document.querySelector('.list-bids-container')) {
        const __ActionsInfo = await import('../pages/invitation-section/actions')
        Menuselector.then(loader => { new loader.default().active('bids-menu-list-all') })
        __ActionsInfo.loadListSection().then(() => {
          __ActionsInfo.list()
        })
      }
      import('./invitation/info')
    },
  }).resolve()
})