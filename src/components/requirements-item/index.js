import style from './style'

export default class {
  constructor(opt = {}) {
    return this.render(opt) 
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
        
        <span class="float-right text-danger">${opt.currency} ${opt.amount}</span>
      `

    // start rendering
    return this.template
  }
}
