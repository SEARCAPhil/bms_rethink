//import style from './style'
const requirementsItem = import('../requirements-item')

export default class {
  constructor(opt = {}) {
    this.__timestamp = Date.now()
    return this.render(opt) 
  }

  render(opt = {}) { 
    this.template = document.createElement('section')
    this.template.style.fontSize = '0.9em'
    this.template.style.marginBottom = '40px'

    // custom classes
    if(opt.class) this.template.classList.add(...opt.class.split(' '))
    
    // template
    this.template.innerHTML = `
      <p>
        <b><i class="material-icons md-18">add_shopping_cart</i> IT EQPT F.Y. 2018-2019 </b><br/>
        Deadline : 2018-04-30
      </p>

      <section style="background:rgba(250,250,250,0.3);padding:5px;">
        <p>
          <span class="badge badge-danger">1</span> <span class="text-danger">Requirements &emsp;
          <u class=""><a href="#/bids/forms/registration/44/steps/3">Add New</a></u></span>
        </p>
        <section class="requirements-items-section" id="item-${this.__timestamp}"></section>
      </section>
      <hr/>
    `
    // get items
    requirementsItem.then(res => {
      const temp = new res.default()
      const id = `#item-${this.__timestamp}`
      // render
      this.template.querySelector(id).append(temp)
    
    })

    // start rendering
    return this.template
  }
}
