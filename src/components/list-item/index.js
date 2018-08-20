import style from './style'

export default class {
  constructor(opt = {}) {
    return this.render(opt) 
  }

  render(opt) { 
    this.template = document.createElement('div')
    this.template.setAttribute('data-list', opt.id)

    // class
    this.template.classList.add(...opt.class.split(' '))
    
    // template
    this.template.innerHTML = `
      <style>${style.toString()}</style>
      <a href="#/bids/${opt.id}/info">
        <h6 class="list-item-header">#${opt.id} 
          ${opt.status == 3 ? '<span class="float-right"><i class="material-icons md-18" style="color:#8BC34A;">check_circle</i></span>' : ''}
          ${opt.status == 5 ? '<span class="float-right"><i class="material-icons md-18 text-muted">lock</i></span>' : ''}
        </h6>
        <small>
          <p style="font-size:smaller;" class="text-muted">
            ${opt.profile_name}<br/>
            ${opt.date_created}
          </p>
        </small>
      </a>
    `
    // start rendering
    return this.template
  }
}

