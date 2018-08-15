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
      <a href="#/inv/${opt.id}/info">
        <span class="list-item-header">${opt.name}</span><br/>
        <p>
          <span class="text-danger">Quantity : ${opt.quantity}</span> - ${opt.unit}
        </p>
        <small>
          <p style="font-size:smaller;" class="text-muted">
            Deadline :${opt.deadline}<br/>
            Bidding Item: # <span class="badge badge-dark">${opt.bidding_requirements_id}</span><br/>
          </p>
        </small>
        <small>REF#${opt.id}</small>
      </a>

      
    `
    // start rendering
    return this.template
  }
}

