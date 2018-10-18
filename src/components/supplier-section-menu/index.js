import style from './style'

export default class {
  constructor(opt = {}) {
    return this.render(opt) 
  }

  bindListeners (opt) {
    // resend
    if(opt.menus.indexOf('resend')!=-1) {
      import('./actions/resend').then(loader => {
        return new loader.default({
          root: this.template,
          selector: '.resend-bidding-modal-btn',
          id: opt.id,
        })
      })
    }

  }

  async render(opt) { 
    const ApiConfig = await import('../../config/api')
    this.template = document.createElement('menu')
    this.template.id = "supplier-section-menu"
    this.template.classList.add('row')

    // custom classes
    if(opt.class) this.template.classList.add(...opt.class.split(' '))
      opt.menus = opt.menus || []
    
    // template
    this.template.innerHTML = `
      <style>${style.toString()}</style>
      <ul class="nav offset-lg-1">
      

        <!-- remove -->
        ${ opt.menus.indexOf('suppliers')!=-1 ?
          `<li class="nav-item ${opt.active === 'suppliers' ? 'active' : ''}">
            <a class="nav-link nav-link suppliers-records-nav supplier-section-nav" href="#/suppliers/all">
              Records
            </a>
          </li>` : ''
        }

        <!-- update -->
        ${ opt.menus.indexOf('register')!=-1 ?
          `<li class="nav-item  ${opt.active === 'register' ? 'active' : ''}">
            <a class="nav-link nav-link supplier-section-nav" href="#/suppliers/forms/registration/">
              Register new <i class="material-icons md-18">add_circle</i>
            </a>
          </li>` : ''
        }

       
      </ul>
    `
    // event listeners
    this.bindListeners(opt)
    // start rendering
    return this.template
  }
}
