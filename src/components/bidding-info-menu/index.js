import style from './style'

export default class {
  constructor(opt = {}) {
    
    return this.render(opt) 
  }

  async render(opt) { 
    const ApiConfig = await import('../../config/api')
    this.template = document.createElement('menu')
    this.template.id = "detail-info-menu"
    this.template.classList.add('row')

    // custom classes
    if(opt.class) this.template.classList.add(...opt.class.split(' '))
    
    // template
    this.template.innerHTML = `
      <style>${style.toString()}</style>
      <ul class="nav offset-lg-1">
      
        <!-- resend -->
        ${ opt.menus.indexOf('resend')!=-1 ?
          `<li class="nav-item">
            <a class="nav-link resend-bidding-modal-btn" href="#" data-target="#general-modal" data-popup-toggle="open">
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
          `<li class="nav-item file-attachment-dialog-btn">
            <a class="nav-link">
              <i class="material-icons md-18">attach_file</i> Attach
            </a>
          </li>` : ''
        }

        <!-- remove -->
        ${ opt.menus.indexOf('attach')!=-1 ?
          `<li class="nav-item">
            <a class="nav-link nav-link remove-bidding-modal-btn" href="#" data-target="#general-modal" data-popup-toggle="open">
              <i class="material-icons md-18">remove_circle_outline</i> Remove
            </a>
          </li>` : ''
        }

        <!-- update -->
        ${ opt.menus.indexOf('update')!=-1 ?
          `<li class="nav-item">
            <a class="nav-link nav-link update-bidding-modal-btn" href="#/bids/forms/registration/${opt.id}/step/1/update">
              Update
            </a>
          </li>` : ''
        }

        <!--print -->
        ${ opt.menus.indexOf('particulars')!=-1 ?
          `<li class="nav-item">
            <a class="nav-link nav-link remove-bidding-modal-btn print-btn" href="#/bids/forms/registration/${opt.id}/step/2/">
              <i class="material-icons md-18">add_circle</i> Particulars
            </a>
          </li>` : ''
        }

        <!--print -->
        ${ opt.menus.indexOf('print')!=-1 ?
          `<li class="nav-item">
            <a class="nav-link nav-link remove-bidding-modal-btn print-btn" href="${ApiConfig.default.url}/bidding/reports/bidding_request.php?id=${opt.id}" target="_blank">
              <i class="material-icons md-18">print</i> 
            </a>
          </li>` : ''
        }
       
      </ul>
    `
    // start rendering
    return this.template
  }
}
