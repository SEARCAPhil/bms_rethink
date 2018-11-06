import style from './style'

export default class {
  constructor(opt = {}) {
    this.__opt = opt
    return this.render(opt) 
  }

  bindRemove () {
    if(!(this.__opt.menus.indexOf('settings')!=-1)) return
    import('./actions/remove').then(loader => {
      return new loader.default({
        root: this.template,
        selector: '.remove-account-modal-btn',
        id: this.__opt.id,
      })
    })
  }

  bindBlock () {
    if(!(this.__opt.menus.indexOf('settings')!=-1)) return
    import('./actions/block').then(loader => {
      return new loader.default({
        root: this.template,
        selector: '.block-account-modal-btn',
        status: this.__opt.status,
        id: this.__opt.id,
      })
    })
  }

  bindChangePass () {
    if(!(this.__opt.menus.indexOf('settings')!=-1)) return
    import('./actions/pass').then(loader => {
      return new loader.default({
        root: this.template,
        selector: '.password-account-modal-btn',
        status: this.__opt.status,
        id: this.__opt.id,
      })
    })
  }

  bindChangePassLink () {
    if(!(this.__opt.menus.indexOf('settings')!=-1)) return
    import('./actions/link').then(loader => {
      return new loader.default({
        root: this.template,
        selector: '.password-link-account-modal-btn',
        status: this.__opt.status,
        id: this.__opt.id,
      })
    })
  }

  bindListeners (opt) {
    this.bindRemove()
    this.bindBlock()
    this.bindChangePass()
    this.bindChangePassLink()
  }

  async render(opt) { 
    const ApiConfig = await import('../../config/api')
    this.template = document.createElement('menu')
    this.template.id = "supplier-info-menu"
    this.template.classList.add('row')

    // custom classes
    if(opt.class) this.template.classList.add(...opt.class.split(' '))
    this.__opt.menus = opt.menus || []
    
    // template
    this.template.innerHTML = `
      <style>${style.toString()}</style>
      <ul class="nav offset-lg-1">
      
        <!-- back -->
        ${ this.__opt.menus.indexOf('back')!=-1 ?
          `<li class="nav-item ${opt.active === 'back' ? 'active' : ''}">
            <a class="nav-link nav-link suppliers-records-nav supplier-section-nav" href="#/suppliers/all" title="back to list">
              <i class="material-icons md-18">arrow_back</i>
            </a>
          </li>` : ''
        }

        <!-- info-->
        ${ this.__opt.menus.indexOf('info')!=-1 ?
          `<li class="nav-item ${opt.active === 'info' ? 'active' : ''}">
            <a class="nav-link nav-link suppliers-records-nav supplier-section-nav" href="#/suppliers/accounts/${opt.id}/info">
              Info
            </a>
          </li>` : ''
        }

        <!-- sessions -->
        ${ this.__opt.menus.indexOf('sessions')!=-1 ?
          `<li class="nav-item ${opt.active === 'sessions' ? 'active' : ''}">
            <a class="nav-link nav-link suppliers-records-nav supplier-section-nav" href="#/suppliers/accounts/${opt.id}/sessions">
              Sessions
            </a>
          </li>` : ''
        }

        <!-- activities -->
        ${ this.__opt.menus.indexOf('activities')!=-1 ?
          `<li class="nav-item ${opt.active === 'activities' ? 'active' : ''}">
            <a class="nav-link nav-link suppliers-records-nav supplier-section-nav" href="#/suppliers/accounts/${opt.id}/activities">
              Activities
            </a>
          </li>` : ''
        }

        <!-- settings -->
        ${ this.__opt.menus.indexOf('settings')!=-1 ?
          `<li class="nav-item ${opt.active === 'settings' ? 'active' : ''}"  style="position: relative;">
            <span class="nav-link nav-link suppliers-records-nav supplier-section-nav device-dropdown" data-device-dropdown="dropdown-${opt.id}" data-resources="${opt.id}">
              <i class="material-icons md-18">settings</i> Settings
            </span>

            <div class="dropdown-section float-right" id="dropdown-${opt.id}" style="width: 250px;">
              <ul class="list-group list-group-flush">
                <li class="list-group-item"><a data-target="#general-modal" data-popup-toggle="open" href="#" class="block-account-modal-btn">Block/Unblock</a></li>
                <li class="list-group-item"><a data-target="#general-modal" data-popup-toggle="open" href="#" class="remove-account-modal-btn">Remove</a></li>
                <li class="list-group-item"><a href="#/suppliers/accounts/forms/registration/profile/${opt.id}/update">Update</a></li>
                <li class="list-group-item"><a data-target="#general-modal" data-popup-toggle="open" href="#" class="password-account-modal-btn">Change Password</a></li>
                <li class="list-group-item"><a data-target="#general-modal" data-popup-toggle="open" href="#" class="password-link-account-modal-btn">Send Reset Password link</a></li>
              <ul>
            </div>

          </li>
            ` : ''
        }

       
      </ul>
    `
    // event listeners
    this.bindListeners(opt)
    // start rendering
    return this.template
  }
}
