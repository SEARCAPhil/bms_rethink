const Navigo = import('navigo')
const DisplayStyler = import('../../utils/display-styler')
const ScriptLoader = import('../../utils/script-loader')
const DropdownLoader = import('../../utils/dropdown-loader')
const Menuselector = import('../../utils/menu-selector')
const BiddingServ = import('../../services/bidding-list-service')




Navigo.then((Navigo) => {
  // Navigo instance
  const appRoute = new Navigo.default('http://localhost/bms_rethink/www/',  true)

  appRoute.on({
    '/bids/reports': async (params) => {
      
      // loade Information section
      return import('../../pages/bidding-report-section').then(res => { 
        // template
        const temp = new res.template()
        const template = temp.render()
        template.then(html => { 
          // DOM
          const infMenu = document.querySelector('report-section') || document.querySelector('#bids-report-section')
          if(infMenu) infMenu.replaceWith(html) 
        })
      })
    }
  }).resolve()
})