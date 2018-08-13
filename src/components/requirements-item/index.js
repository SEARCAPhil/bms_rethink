import style from './style'

export default class {
  constructor(opt = {}) {
    this.opt = opt
    return this.render(opt) 
  }

  __bindListeners (opt) {
    import('./actions/remove').then(loader => {
      return new loader.default({
        root: this.template,
        selector: '.remove-requirements-modal-btn',
        id: opt.id,
      })
    })  
  }

  render(opt = {}) { 
    this.template = document.createElement('div')
    this.template.classList.add('requirement-item')
    this.__funds = opt.funds.map(val => `<span class="badge badge-dark">${val.fund_type} - ${val.cost_center} - ${val.line_item}</span>`)

    // custom classes
    if(opt.class) this.template.classList.add(...opt.class.split(' '))
    
    // template
    this.template.innerHTML = `
      <style>${style.toString()}</style>
        <b><a href="#/bids/requirements/${opt.id}"><u>${opt.name}</u></a></b> 
        <span>(${opt.quantity} ${opt.unit})</span>
        ${this.__funds}
        
        ${opt.awarded ? `<span class="" style="color:#ffb80c;">
          <i class="material-icons md-18">star</i> 
          <span>Awarded</span>
        </span>` : ''}

        <span class="">
          ${opt.menus['update'] ? `<a href="#/bids/forms/registration/${opt.id}/step/3/update"><i class="material-icons md-12 text-muted">edit</i></a>` : '' }
          ${opt.menus['remove'] ? `<a href="#" class="remove-requirements-modal-btn" data-target="#general-modal" data-popup-toggle="open" id="${opt.id}">
            <i class="material-icons md-12 text-muted" id="${opt.id}">remove_circle_outline</i>
          </a>&emsp;` : '' }
        </span>
          
        <span class="float-right text-danger">${opt.currency} ${opt.amount}</span>
      `
    this.__bindListeners(opt)
    // start rendering
    return this.template
  }
}
