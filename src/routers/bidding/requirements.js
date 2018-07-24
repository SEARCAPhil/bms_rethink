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
    '' : () => { },
    '/bids/requirements/:id': async (params) => {
      // change visibility
      DisplayStyler.then(display => {
        display.default(['splash-page', '.welcome-section', '#initial-section', '#bids-info-container'], 'none')
        display.default(['#requirements-container'], 'block')
      })  

      // load Information section
      import('../../pages/bidding-req-section').then(res => { 
        // template
        const temp = new res.template({id: params.id})
        const template = temp.render()
        template.then(html => { 
          // DOM
          const reqSec = document.querySelector('requirement-section') || document.querySelector('#requirement-container')
          if(reqSec) reqSec.replaceWith(html) 
         
          // other content
          temp.setStatus()
 
        }).then(() => { 
          temp.getAttachments()
          temp.getAwardees() 
        })

       
      })

      // load proposal section
      return import('../../pages/requirement-proposal-section').then(res => {
        // template
        const temp = new res.default({id: params.id})
        temp.then(html => { 
          // DOM
          const reqSec = document.querySelector('proposal-section') || document.querySelector('#requirement-proposal-container')
          if(reqSec) reqSec.replaceWith(html) 
        })
      })
    }
  }).resolve()
})