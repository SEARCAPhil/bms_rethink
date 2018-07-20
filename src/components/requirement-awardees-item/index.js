import style from './style'

export default class {
  constructor(opt = {}) {
    return this.render(opt) 
  }

  render(opt = {}) { 
    this.template = document.createElement('div')
    this.template.classList.add(`requirement-awardees-item-${opt.id}`)
    this.__stat = ''
    // custom classes
    if(opt.class) this.template.classList.add(...opt.class.split(' '))
    
    // template
    this.template.innerHTML = `
      <style>${style.toString()}</style>
        
      ${
        opt.status != 2 ?
      `<span class="float-right" data-resources="${opt.id}" id="${opt.id}"> 
        <a href="#" data-target="#bidding-requirements-modal" data-popup-toggle="open" class="remove-awardees-modal btn btn-danger btn-sm" data-resources="${opt.id}"> 
          Remove
        </a> &emsp;` : ''
      }
        
        ${
          opt.status == 2 ? `<span class="float-right" style="color:#ffb80c;" data-resources="${opt.id}" id="${opt.id}"><i class="material-icons md-18">star</i> Awarded</span>`:
          `<a class="award-list-modal-btn text-danger" id="${opt.id}" data-resources="${opt.id}" data-target="#bidding-requirements-modal" data-popup-toggle="open">
            <i class="material-icons md-18">card_membership</i> Click to Award
          </a>`
        }
      </span>

      <details class="col-12 row">
        <summary> <span class="text-success">${opt.name}</span> ${this.__stat}</summary><br/>
        <p class="col-12">
         
        </p>

        <p class="col-12 text-muted">${opt.remarks}</p>
        <feedback-section></feedback-section>
        <p class="col-12  rating-feedback-section"><br/></p>
			</details>`

    // start rendering
    return this.template
  }
}
