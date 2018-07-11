const Navigo = import('navigo')
const DisplayStyler = import('../../utils/display-styler')

const loadForm = () => {
  // fetch registration form
  return import('../../pages/bidding-reg-form').then(res => {
    const targ = document.querySelector('registration-section')
    targ.classList.add('col', 'col-lg-10')
    targ.innerHTML = '<style>registration-section { height:100vh;overflow-y:auto; } </style>'
    targ.append(res.template)
  })
}

const register = () => {
  const serv = import('../../pages/bidding-reg-form/actions')
  serv.then(loader => {
    document.querySelector('.add-bidding-button').addEventListener('click', loader.register)
    
  })
}

const showContainer = () => {
  // change visibility
  DisplayStyler.then(display => {
    display.default(['splash-page', '.welcome-section', '#initial-section', '#bids-info-container'], 'none')
    display.default(['.bids-info-container', 'registration-section'], 'block')
  }) 
}

Navigo.then((Navigo) => {
  // Navigo instance
  const appRoute = new Navigo.default('http://localhost/bms_rethink/www/',  true)

  appRoute.on({
    '' : () => { },
    '/bids/forms/registration/step/1': () => {
      
      // load form
      showContainer()
      loadForm().then(() => {
        register()
      })
      
    },
    '/bids/forms/registration/:id/step/2': () => {
      showContainer()
      return import('../../pages/bidding-part-form').then(res => {
        const targ = document.querySelector('registration-section')
        targ.classList.add('col', 'col-lg-10')
        targ.innerHTML = '<style>registration-section { height:100vh;overflow-y:auto; } </style>'
        targ.append(res.template)
      })
    },
    '/bids/forms/registration/:id/step/3': () => {
      showContainer()
      return import('../../pages/bidding-prod-form').then(res => {
        const targ = document.querySelector('registration-section')
        targ.classList.add('col', 'col-lg-10')
        targ.innerHTML = '<style>registration-section { height:100vh;overflow-y:auto; } </style>'
        targ.append(res.template)
      })
    },
    '/bids/forms/registration/:id/step/4/:pid': () => {
      showContainer()
      return import('../../pages/bidding-prod-form/confirmation').then(res => {
        const targ = document.querySelector('registration-section')
        targ.classList.add('col', 'col-lg-10')
        targ.innerHTML = '<style>registration-section { height:100vh;overflow-y:auto; } </style>'
        targ.append(res.template)
      })
    }
  }).resolve()
})