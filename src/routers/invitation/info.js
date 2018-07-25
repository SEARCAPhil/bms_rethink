const Navigo = import('navigo')
const DisplayStyler = import('../../utils/display-styler')
const ScriptLoader = import('../../utils/script-loader')
const DropdownLoader = import('../../utils/dropdown-loader')
const Menuselector = import('../../utils/menu-selector')
const Serv = import('../../services/bidding-inv-service')
const CustomerReviews = import('../../components/customer-reviews')

// change list to active
const activateList = (id) => { 
  document.querySelectorAll(`.list`).forEach((el, index) => {
    if (el.getAttribute('data-list') == id) {
      el.classList.add('active')
    } else {
      el.classList.remove('active')
    }
  })
}


Navigo.then((Navigo) => {
  // Navigo instance
  const appRoute = new Navigo.default('http://localhost/bms_rethink/www/',  true)

  appRoute.on({
    '' : () => { },
    '/inv/:id/info/': async (params) => { 
      // change visibility
      DisplayStyler.then(display => {
        display.default(['splash-page', '.welcome-section', '#initial-section'], 'none')
        display.default(['#bids-info-container'], 'block')
      })  

      activateList(params.id)

      // loade Information section
      import('../../pages/invitation-info-section').then(res => {
        // template
        const temp = new res.template({id: params.id})
        const template = temp.render()
        template.then(html => { 
  
          // DOM
          const infMenu = document.querySelector('info-section') || document.querySelector('#inv-info-container')
          if(infMenu) infMenu.replaceWith(html) 
         
          // other content
          temp.setStatus()
 
        }).then(() => { 
          //temp.getAttachments()
          //temp.getParticulars() 

         
        })
        
      })

    }
  }).resolve()
})