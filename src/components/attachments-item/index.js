import style from './style'
import ApiConfig from '../../config/api'

const fileIconCss = import('../../assets/css/fileicon.css')

export default class {
  constructor(opt = {}) {
    return this.render(opt) 
  }

  bindListeners (opt) {
    // bind remove action
    if(opt.menus.indexOf('remove')!=-1) {
      import('./actions/remove').then(loader => {
        return new loader.default({
          root: this.template,
          selector: '.remove-attachments-modal',
          id: opt.id
        })
      })
    }
    import('../popup-es').then(loader => new loader.default())
  }

  render(opt = {}) { 
    opt.menus = opt.menus || []
    this.template = document.createElement('section')
    this.template.classList.add('col-lg-3', 'col-md-3')
    this.template.id = `attachments-info-section-${opt.id}`

    // custom classes
    if(opt.class) this.template.classList.add(...opt.class.split(' '))
    
    
    // template
    this.template.innerHTML = `
        <style>${style.toString()}</style>
        <div class="d-flex align-items-stretch attachment-items">
          <div class="col-10">
            <div class="file-icon file-icon-sm" data-type="${opt.type}"></div> ${opt.original_filename}
          </div>
          <div class="col-2">
            <i class="material-icons md-18 device-dropdown" data-device-dropdown="dropdown-${opt.id}" data-resources="${opt.id}">arrow_drop_down</i>
            <div class="dropdown-section float-right" id="dropdown-${opt.id}">
              <ul class="list-group list-group-flush">
                <li class="list-group-item"><a href="#" onclick="event.preventDefault();window.open('${ApiConfig.url}/bidding/attachments/download.php?id=${opt.id}')">Download</a></li>
                
                ${ opt.menus.indexOf('remove') !=-1 ?
                  `<li class="list-group-item"><a data-target="#general-modal" data-popup-toggle="open" href="#" class="remove-attachments-modal">Remove</a></li>` : ``
                }

              <ul>
            </div>
          </div>
        </div>
      `
    this.bindListeners(opt)
    // start rendering
    return this.template
  }
}
