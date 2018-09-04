const Navigo = import('navigo')
const DisplayStyler = import('../utils/display-styler')
const ScriptLoader = import('../utils/script-loader')
const Menuselector = import('../utils/menu-selector')

 
Navigo.then((Navigo) => {
  // Navigo instance
  const appRoute = new Navigo.default('http://localhost/bms_rethink/www/',  true)
  const appRoute2 = new Navigo.default('http://localhost/bms_rethink/www/',  true)

  const loadSupplierSection = (opt = {}) => {
    // loade Information section
    return import('../pages/supplier-section').then(res => { 
      // template
      const temp = new res.template(opt)
      const template = temp.render()
      template.then(html => {
        // DOM
        const infMenu = document.querySelector('supplier-section') || document.querySelector('#supplier-section')
        if(infMenu) infMenu.replaceWith(html) 
        // other content
        //temp.setStatus()
      }).then(() => { 
       
      })
    })
  }

  const loadSuppliersListSection = () => {
    // loade Information section
    return import('../pages/supplier-list-section').then(res => { 
      // template
      const temp = new res.template({})
      const template = temp.render()
      template.then(html => {
        // DOM
        const infMenu = document.querySelector('suppliers-section-container')
        if(infMenu) infMenu.append(html) 
      })
    })
  }

  const loadSuppliersInfoSection = (opt) => {
    import('../pages/supplier-info-section').then(res => {
      new res.default(opt).render().then(html => {
        const sec = document.querySelector('supplier-section') || document.querySelector('#supplier-section')
        if(sec) sec.replaceWith(html) 
      })
    })
  }

  const setActiveMenu = (className) => { 
    document.querySelectorAll('.supplier-section-nav').forEach((el, index) => { 
      let a = el.classList.contains(className) ? el.parentNode.classList.add('active') : el.parentNode.classList.remove('active')
    })
  }

  appRoute.on({
    '' : () => { },
    '/suppliers/*' : (params) => {
      // change visibility
      DisplayStyler.then(display => {
        display.default(['splash-page', '.bidding-module-container'], 'none')
        display.default(['.supplier-module-container'], 'block')
      })
    }
  }).resolve()

  
  appRoute2.on({
    '' : () => { },
    '/suppliers/welcome' : () => {
      loadSupplierSection({}).then(() => {
        import('../pages/initial-supplier-section').then(res => {
          if(document.querySelector('suppliers-section-container')) {
            document.querySelector('suppliers-section-container').innerHTML = ''
            document.querySelector('suppliers-section-container').append(res.default)
          }
        })
      })
    },
    '/suppliers/all' : async () => { 
      loadSupplierSection({
        active: 'suppliers'
      }).then(() => {
        document.querySelector('suppliers-section-container').innerHTML = ''
        loadSuppliersListSection()
      })
      //setTimeout(() => { setActiveMenu('suppliers-records-nav') }, 800)
      //InitSection.then(res => document.querySelector('initial-section') ? document.querySelector('initial-section').replaceWith(res.default) : 0)
    },
    '/suppliers/:id/info' : async (params) => {
      params.active = 'about' 
      loadSuppliersInfoSection(params)
    },
    '/suppliers/:id/products' : async (params) => {
      params.active = 'products' 
      loadSuppliersInfoSection(params)
    },
    '/suppliers/:id/accounts' : async (params) => {
      params.active = 'accounts' 
      loadSuppliersInfoSection(params)
    },
    '/suppliers/accounts/*' : async (params) => {
      import('./suppliers/accounts')
    },

  }).resolve()
})