import style from './style'

export default class {
  constructor(opt = {}) {
    return this.render(opt) 
  }

  bindListeners (opt) {
    
  }

  async render(opt) { 
    const ApiConfig = await import('../../config/api')
    this.template = document.createElement('menu')
    this.template.id = "supplier-info-menu"
    this.template.classList.add('row')

    // custom classes
    if(opt.class) this.template.classList.add(...opt.class.split(' '))
      opt.menus = opt.menus || []
    
    // template
    this.template.innerHTML = `
      <style>${style.toString()}</style>
      <ul class="nav offset-lg-1">
      
        <!-- back -->
        ${ opt.menus.indexOf('back')!=-1 ?
          `<li class="nav-item ${opt.active === 'back' ? 'active' : ''}">
            <a class="nav-link nav-link suppliers-records-nav supplier-section-nav" href="#/suppliers/all" title="back to list">
              <i class="material-icons md-18">arrow_back</i>
            </a>
          </li>` : ''
        }

        <!-- info-->
        ${ opt.menus.indexOf('info')!=-1 ?
          `<li class="nav-item ${opt.active === 'info' ? 'active' : ''}">
            <a class="nav-link nav-link suppliers-records-nav supplier-section-nav" href="#/suppliers/${opt.id}/info">
              Info
            </a>
          </li>` : ''
        }

        <!-- sessions -->
        ${ opt.menus.indexOf('sessions')!=-1 ?
          `<li class="nav-item ${opt.active === 'sessions' ? 'active' : ''}">
            <a class="nav-link nav-link suppliers-records-nav supplier-section-nav" href="#/suppliers/${opt.id}/info">
              Sessions
            </a>
          </li>` : ''
        }

        <!-- activities -->
        ${ opt.menus.indexOf('activities')!=-1 ?
          `<li class="nav-item ${opt.active === 'accounts' ? 'active' : ''}">
            <a class="nav-link nav-link suppliers-records-nav supplier-section-nav" href="#/suppliers/${opt.id}/accounts">
              Activities
            </a>
          </li>` : ''
        }

        <!-- settings -->
        ${ opt.menus.indexOf('settings')!=-1 ?
          `<li class="nav-item ${opt.active === 'settings' ? 'active' : ''}">
            <a class="nav-link nav-link suppliers-records-nav supplier-section-nav" href="#/suppliers/${opt.id}/products">
            <i class="material-icons md-18">settings</i> Settings
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