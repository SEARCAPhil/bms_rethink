import style from './style'
import ApiConfig from '../../config/api'

const fileIconCss = import('../../assets/css/fileicon.css')

export default class {
  constructor(opt = {}) {
    return this.render(opt) 
  }

  render(opt = {}) { 
    this.template = document.createElement('section')
    this.template.classList.add('col-lg-3', 'col-md-3')

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
            <i class="material-icons md-18 device-dropdown data-bind-dropdown" data-device-dropdown="dropdown-${opt.id}" data-resources="${opt.id}">arrow_drop_down</i>
            <div class="dropdown-section float-right" id="dropdown-${opt.id}">
              <ul class="list-group list-group-flush">
                <li class="list-group-item"><a href="#" onclick="event.preventDefault();window.open('${ApiConfig.url}/bidding/attachments/download.php?id=${opt.id}')">Download</a></li>
                <li class="list-group-item for-open"><a data-target="#bidding-modal" data-popup-toggle="open" href="#" class="remove-attachments-modal">Remove</a></li>
              <ul>
            </div>
          </div>
        </div>
      `
    // start rendering
    return this.template
  }
}
