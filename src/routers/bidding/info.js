const Navigo = import('navigo')
const DisplayStyler = import('../../utils/display-styler')
const ScriptLoader = import('../../utils/script-loader')
const DropdownLoader = import('../../utils/dropdown-loader/index')
const Menuselector = import('../../utils/menu-selector')
const InfoSection = import('../../pages/bidding-info-section')
const BiddingServ = import('../../services/bidding-list-service')
const ParticularsItem = import('../../components/particulars-item')
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
    '/bids/:id/info/': (params) => {
      // change visibility
      DisplayStyler.then(display => {
        display.default(['splash-page', '.welcome-section', '#initial-section'], 'none')
        display.default(['#bids-info-container'], 'block')
      })  

      activateList(params.id)


      // loade Information section
      InfoSection.then(res => {
        // template
        const temp = new res.template({id: params.id})
        const template = temp.render()
        template.then(html => { 
          // DOM
          const infMenu = document.querySelector('info-section')
          if(infMenu) infMenu.replaceWith(html)

          // other content
          temp.setStatus()
          
        }).then(() => {

          temp.getAttachments()
        })

        
        /*
        

        ParticularsItem.then(res => {
          const targ = document.querySelector('.particulars-section')
          targ.append(new res.default())
        })

        CustomerReviews.then(res => {
          const targ = document.querySelector('.reviews-section')
          targ.append(new res.default())
        })*/
        
      })
    }
  }).resolve()
})