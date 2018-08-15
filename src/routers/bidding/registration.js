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
    display.default(['splash-page', '.welcome-section', '#initial-section', '#bids-info-container', '#requirement-container', '#requirement-proposal-container'], 'none')
    display.default(['.bids-info-container', 'registration-section'], 'block')
  }) 

  // spinner
  import('../../components/app-spinner').then(loader => {
    return new loader.default().show({target: 'registration-section'}).then(t => t.template.show())
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
        setTimeout(() => {
          const s = document.querySelector('registration-section > .spinner')
          if(s) document.querySelector('registration-section > .spinner').remove()
        }, 3000)
      })
    },
    '/bids/forms/registration/:id/step/1/update': (params) => { 
      // load form
      showContainer()
      loadForm().then(() => {
        const serv = import('../../pages/bidding-reg-form/actions')
        serv.then(loader => {
          const btn = document.querySelector('.add-bidding-button')
          btn.id = params.id
          btn.addEventListener('click', loader.update) 
        })
      })
    },
    '/bids/forms/registration/:id/step/2': (params) => {
      showContainer()
      const targ = document.querySelector('registration-section')
      targ.classList.add('col', 'col-lg-10')
      

      return import('../../pages/bidding-part-form').then(res => {
        new res.default({
          action: 'create',
          id: params.id,
        }).then(html => {
          targ.innerHTML = '<style>registration-section { height:100vh;overflow-y:auto; } </style>'
          targ.append(html)
        })
      })
    },
    '/bids/forms/registration/:id/step/2/update': (params) => {
      showContainer()
      const targ = document.querySelector('registration-section')
      targ.classList.add('col', 'col-lg-10')

      return import('../../pages/bidding-part-form').then(res => {
        new res.default({
          action: 'update',
          id: params.id,
        }).then(html => {
          targ.innerHTML = '<style>registration-section { height:100vh;overflow-y:auto; } </style>'
          targ.append(html)
        })
      })
    },
    '/bids/forms/registration/:id/step/3': (params) => {
      showContainer()
      const targ = document.querySelector('registration-section')
      targ.classList.add('col', 'col-lg-10')

      return import('../../pages/bidding-prod-form').then(res => {
        new res.default({
          action: 'create',
          id: params.id,
        }).then(html => {
          targ.innerHTML = '<style>registration-section { height:100vh;overflow-y:auto; } </style>'
          targ.append(html)
        })
      })
    },
    '/bids/forms/registration/:id/step/3/update': (params) => {
      showContainer()
      const targ = document.querySelector('registration-section')
      targ.classList.add('col', 'col-lg-10')

      return import('../../pages/bidding-prod-form').then(res => {
        new res.default({
          action: 'update',
          id: params.id,
        }).then(html => {
          targ.innerHTML = '<style>registration-section { height:100vh;overflow-y:auto; } </style>'
          targ.append(html)
        })
      })
    },
    '/bids/forms/registration/:id/step/4/:pid': (params) => {
      showContainer()
      const targ = document.querySelector('registration-section')
      targ.classList.add('col', 'col-lg-10')

      return import('../../pages/bidding-prod-form/confirmation').then(res => {
        new res.default({
          id: params.id,
          pid: params.pid,
        }).then(html => {
          targ.innerHTML = '<style>registration-section { height:100vh;overflow-y:auto; } </style>'
          targ.append(html)
        })
      })
    }
  }).resolve()
})