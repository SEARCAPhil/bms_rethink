const Navigo = import('navigo')
const DisplayStyler = import('../utils/display-styler')
const ScriptLoader = import('../utils/script-loader')
const Menuselector = import('../utils/menu-selector')

 
Navigo.then((Navigo) => {
  // Navigo instance
  const appRoute = new Navigo.default('http://localhost/bms_rethink/www/',  true)


  appRoute.on({
    '' : () => { },
    '/feedback/*' : () => {
      // change visibility
      DisplayStyler.then(display => {
        display.default(['splash-page', '.welcome-section', 'registration-section', '#bids-report-section', '#bids-info-container', '#bids-report-section'], 'none')
        display.default(['#feedback-section'], 'block')
      })

      // loade Information section
      return import('../pages/feedback-form').then(res => { 
        // template
        const temp = new res.template()
        const template = temp.render()
        template.then(html => { 
          // DOM
          const infMenu = document.querySelector('feedback-section') || document.querySelector('#feedback-section')
          if(infMenu) infMenu.replaceWith(html) 
        })
      })
    }
  }).resolve()

})