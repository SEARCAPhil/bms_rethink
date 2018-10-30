const Navigo = import('navigo')
const DisplayStyler = import('../../utils/display-styler')
const DropdownLoader = import('../../utils/dropdown-loader/')
 
Navigo.then((Navigo) => {
  // Navigo instance
  const appRoute = new Navigo.default('http://localhost/bms_rethink/www/',  true)
  const appRoute2 = new Navigo.default('http://localhost/bms_rethink/www/',  true)

  const loadSuppliersInfoSection = (opt) => {
    import('../../pages/account-info-section').then(res => {
      new res.default(opt).render().then(html => {
        const sec = document.querySelector('supplier-section') || document.querySelector('#supplier-section')
        if(sec) sec.replaceWith(html) 
        // dropdown
        setTimeout(() => DropdownLoader.then(loader =>  loader.default('device-dropdown')), 700)
      })
    })
  }

  const loadAccountFormSection = (opt) => {
    import('../../pages/supplier-account-profile-form').then(res => {
      new res.default(opt).then(html => {
        const sec = document.querySelector('supplier-section') || document.querySelector('#supplier-section')
        if(sec) sec.replaceWith(html) 
        // dropdown
        setTimeout(() => DropdownLoader.then(loader =>  loader.default('device-dropdown')), 700)
      })
    })
  }

  appRoute.on({
    '' : () => { },
    '/suppliers/accounts/*' : (params) => {
      // change visibility
      DisplayStyler.then(display => {
        display.default(['splash-page', '.bidding-module-container'], 'none')
        display.default(['.supplier-module-container'], 'block')
      })
    }
  }).resolve()

  
  appRoute2.on({
    '' : () => { },
    '/suppliers/accounts/:id/info' : async (params) => {
      params.active = 'info'
      loadSuppliersInfoSection(params)
    },
    '/suppliers/accounts/:id/sessions' : async (params) => {
      params.active = 'sessions'
      loadSuppliersInfoSection(params)
    },
    '/suppliers/accounts/:id/activities' : async (params) => {
      params.active = 'activities'
      loadSuppliersInfoSection(params)
    },
    '/suppliers/accounts/forms/registration/profile/:id' : async (params) => {
      loadAccountFormSection(params)
    },

  }).resolve()
})