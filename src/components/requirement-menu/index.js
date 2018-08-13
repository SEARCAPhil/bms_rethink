import style from './style'

export default class {
  constructor(opt = {}) {
    return this.render(opt) 
  }

  bindListeners (opt) {
    // deadline
    if(opt.menus.indexOf('deadline')!=-1) {
      import('./actions/deadline').then(loader => {
        return new loader.default({
          root: this.template,
          selector: '.set-deadline-modal-btn',
          id: opt.id,
        })
      })
    }

    // invitation (QUICK)
    if(opt.menus.indexOf('invite')!=-1) {
      import('./actions/invite_quick').then(loader => {
        return new loader.default({
          root: this.template,
          selector: '.send-requirements-modal-btn',
          id: opt.id,
        })
      })

      import('./actions/invite_advanced').then(loader => {
        return new loader.default({
          root: this.template,
          selector: '.send-requirements-selected-modal-btn',
          id: opt.id,
          bidding_id: opt.bidding_id,
        })
      })
    }

     // deadline
     if(opt.menus.indexOf('winner')!=-1) {
      import('./actions/winner').then(loader => {
        return new loader.default({
          root: this.template,
          selector: '.award-requirements-modal-btn',
          id: opt.id,
        })
      })
    }

    // deadline
    if(opt.menus.indexOf('attach')!=-1) {
    import('./actions/attach').then(loader => {
      return new loader.default({
        root: this.template,
        selector: '.file-attachment-requirement-dialog-btn',
        id: opt.id,
      })
    })
  }
  }

  async render(opt) { 
    const ApiConfig = await import('../../config/api')
    this.template = document.createElement('menu')
    this.template.id = "requirement-info-menu"
    this.template.classList.add('row')

    // custom classes
    if(opt.class) this.template.classList.add(...opt.class.split(' '))
      opt.menus = opt.menus || []
    
    // template
    this.template.innerHTML = `
      <style>${style.toString()}</style>
      <ul class="nav offset-lg-1">

      ${ opt.menus.indexOf('back')!=-1 ?
        `<li class="nav-item">
            <a class="nav-link back-to-bidding-btn" href="#" onclick="event.preventDefault();history.go(-1);">
                <i class="material-icons md-18">keyboard_return</i> Back
            </a>
        </li>` : ''
      }


      ${ opt.menus.indexOf('invite')!=-1 ?
        `<li class="nav-item send-requirements-group" style="position:relative;"> 
          <a href="#" class="device-dropdown nav-link " data-device-dropdown="invite-menu-drop" onclick="event.preventDefault();">
              <i class="material-icons md-18">insert_invitation</i> Invite <i class="material-icons md-18">expand_more</i>
          </a>
          <div class="dropdown-section float-right" id="invite-menu-drop" style="right:0px;width:200px;">
            <ul class="list-group list-group-flush">
              <li class="list-group-item">
                <a href="#" onclick="event.preventDefault()" class="nav-link send-requirements-modal-btn" data-target="#general-modal" data-popup-toggle="open">
                  Quick<br/><small>(Send invitation for this item only)</small>	
                </a>
              </li>
              <li class="list-group-item">
                <a href="#" onclick="event.preventDefault()" class="nav-link send-requirements-selected-modal-btn" data-target="#general-modal" data-popup-toggle="open">
                  Advanced
                </a>
              </li>
            <ul>
          </div>
        </li>` : ''
      }


      ${ opt.menus.indexOf('attach')!=-1 ?
        `<li class="nav-item">
            <a class="nav-link file-attachment-requirement-dialog-btn">
                <i class="material-icons md-18">attach_file</i> Attach
            </a>
        </li>` : ''
      }

      ${ opt.menus.indexOf('winner')!=-1 ?
        `<li class="nav-item">
            <a class="nav-link award-requirements-modal-btn" data-target="#general-modal" data-popup-toggle="open">
              <i class="material-icons md-18">card_membership</i> Select Winner <small>(*bidding exemption)</small>
            </a>
          </li>` : ''
      }


      ${ opt.menus.indexOf('deadline')!=-1 ?
        `<li class="nav-item">
            <a href="#" class="nav-link text-danger set-deadline-modal-btn" data-target="#general-modal" data-popup-toggle="open">
                <i class="material-icons md-18">date_range</i> Set deadline
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
