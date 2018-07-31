import style from './style'

export default class {
  constructor(opt = {}) {
    return this.render(opt) 
  }

  bindListeners (opt) {

    // bind remove action
    /*if(opt.menus.indexOf('send')!=-1) {
      import('./actions/send').then(loader => {
        return new loader.default({
          root: this.template,
          selector: '.send-bidding-modal-btn',
          id: opt.id,
        })
      })
    }*/

    if(opt.menus.indexOf('remove')!=-1) {
      import('./actions/remove').then(loader => {
        return new loader.default({
          root: this.template,
          selector: '.remove-prop-modal-btn',
          id: opt.id,
        })
      })

      import('./actions/attach').then(loader => {
        return new loader.default({
          root: this.template,
          selector: '.file-prop-attachment-dialog-btn',
          id: opt.id,
          target: 'body',
        })
      })

      import('./actions/view').then(loader => {
        return new loader.default({
          root: this.template,
          selector: '.proposal-reg-dialog-btn-update',
          id: opt.id,
          dialogId: '1-2',
          target: '.bidding-section',
        })
      })

      
    }
  
  }

  async render(opt) { 
    const ApiConfig = await import('../../config/api')
    this.template = document.createElement('menu')
    this.template.id = "proposal-menu"
    this.template.classList.add('row')

    // custom classes
    if(opt.class) this.template.classList.add(...opt.class.split(' '))
      opt.menus = opt.menus || []
    
    // template
    this.template.innerHTML = `
      <style>${style.toString()}</style>
      <ul class="nav offset-lg-1">
      
        <!-- resend -->
        ${ opt.menus.indexOf('return')!=-1 ?
          `<li class="nav-item">
            <a class="nav-link return-bidding-modal-btn" href="#" data-target="#general-modal" data-popup-toggle="open">
              <i class="material-icons md-18">keyboard_return</i> Return 
            </a>
          </li>` : ''
        }

        <!-- send -->
        ${ opt.menus.indexOf('send')!=-1 ?
          `<li class="nav-item">
            <a class="nav-link send-bidding-modal-btn"  href="#" data-target="#general-modal" data-popup-toggle="open">
              <i class="material-icons md-18">send</i> Send 
            </a>
          </li>` : ''
        }


        <!-- attach -->
        ${ opt.menus.indexOf('attach')!=-1 ?
          `<li class="nav-item file-prop-attachment-dialog-btn">
            <a class="nav-link">
              <i class="material-icons md-18">attach_file</i> Attach
            </a>
          </li>` : ''
        }

        <!-- remove -->
        ${ opt.menus.indexOf('remove')!=-1 ?
          `<li class="nav-item">
          <a class="nav-link remove-prop-modal-btn" href="#" data-target="#general-modal" data-popup-toggle="open" data-resources="${opt.id}">
            <i class="material-icons md-18">remove_circle_outline</i> Remove
          </a>
          </li>` : ''
        }

        <!-- update -->
        ${ opt.menus.indexOf('update')!=-1 ?
          `<li class="nav-item">
            <a class="nav-link proposal-reg-dialog-btn-update" href="#" onclick="event.preventDefault();">
              Update
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
