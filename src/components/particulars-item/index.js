//import style from './style'
const requirementsItem = import('../requirements-item')

export default class {
  constructor(opt = {}) {
    this.__timestamp = Date.now()
    this.opt = opt
    return this.render(opt) 
  }

  render(opt = {}) { 
    this.template = document.createElement('section')
    this.template.style.fontSize = '0.9em'
    this.template.style.marginBottom = '40px'

    // custom classes
    if(opt.class) this.template.classList.add(...opt.class.split(' '))
    console.log(opt)
    // template
    this.template.innerHTML = `
      <p>
        <b><i class="material-icons md-18">add_shopping_cart</i> ${opt.name} </b><br/>
        Deadline : ${opt.deadline} 
      </p>

      <section style="background:rgba(250,250,250,0.3);padding:5px;">
        <p>
          <span class="badge badge-danger">1</span> <span class="text-danger">Requirements &emsp;
          <u class=""><a href="#/bids/forms/registration/${this.opt.id}/step/3">Add New</a></u></span>
        </p>
        <section class="requirements-items-section" id="item-${this.__timestamp}"></section>
      </section>
      <hr/>
    `
    // get items
    requirementsItem.then(res => {
      const id = `#item-${this.__timestamp}`
      this.opt.requirements.forEach((el, index) => {
      // render
      this.template.querySelector(id).append(
        new res.default({
          id: el.id,
          name: el.name,
          currency: el.budget_currency,
          amount: new Intl.NumberFormat('en-us', {maximumSignificantDigits:3}).format(el.budget_amount),
          deadline: el.deadline,
          funds: el.funds,
          awarded: el.awardees.length,
          quantity: el.quantity,
          unit: el.unit,
        }))
      })
      /*const temp = new res.default({
        name: this.opt.name,
        deadline: this.opt.deadline,
        requirements: this.opt.requirements
      })
      const id = `#item-${this.__timestamp}`
      
      // render
      this.template.querySelector(id).append(temp)*/
    
    })

    // start rendering
    return this.template
  }
}
