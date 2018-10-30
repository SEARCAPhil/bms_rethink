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
            <a class="nav-link nav-link suppliers-records-nav supplier-section-nav" href="#/suppliers/accounts/${opt.id}/info">
              Info
            </a>
          </li>` : ''
        }

        <!-- sessions -->
        ${ opt.menus.indexOf('sessions')!=-1 ?
          `<li class="nav-item ${opt.active === 'sessions' ? 'active' : ''}">
            <a class="nav-link nav-link suppliers-records-nav supplier-section-nav" href="#/suppliers/accounts/${opt.id}/sessions">
              Sessions
            </a>
          </li>` : ''
        }

        <!-- activities -->
        ${ opt.menus.indexOf('activities')!=-1 ?
          `<li class="nav-item ${opt.active === 'activities' ? 'active' : ''}">
            <a class="nav-link nav-link suppliers-records-nav supplier-section-nav" href="#/suppliers/accounts/${opt.id}/activities">
              Activities
            </a>
          </li>` : ''
        }

        <!-- settings -->
        ${ opt.menus.indexOf('settings')!=-1 ?
          `<li class="nav-item ${opt.active === 'settings' ? 'active' : ''}"  style="position: relative;">
            <span class="nav-link nav-link suppliers-records-nav supplier-section-nav device-dropdown" data-device-dropdown="dropdown-${opt.id}" data-resources="${opt.id}">
              <i class="material-icons md-18">settings</i> Settings
            </span>

            <div class="dropdown-section float-right" id="dropdown-${opt.id}">
              <ul class="list-group list-group-flush">
                <li class="list-group-item"><a href="#" onclick="event.preventDefault();">Block/Unblock</a></li>
                <li class="list-group-item"><a data-target="#general-modal" data-popup-toggle="open" href="#" class="remove-attachments-modal">Remove</a></li>
                <li class="list-group-item"><a href="#/suppliers/accounts/forms/registration/${opt.id}/update">Update</a></li>
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
