import style from '../general-style/circle-marker'
const requirementsItem = import('../requirements-item')


export default class {
  constructor(opt = {}) {
    this.__timestamp = Date.now()
    this.opt = opt
    this.opt.menus = opt.menus || []
    return this.render(opt) 
  }
  __bindListeners () {
    if(this.opt.menus.indexOf('remove')!=-1) {
      import('./actions/remove').then(loader => {
        return new loader.default({
          root: this.template,
          selector: '.remove-particular-modal-btn',
          id: this.opt.id,
        })
      })
    }
  }

  __loadPopup () {

    const popupes = import('../../components/popup-es')
    const popupesStyle = import('../../components/popup-es/style')
  
      // enable popup
      popupesStyle.then(css => {
        const style = document.createElement('style')
        style.id = 'popup-es-style'
        style.innerHTML = css.default.toString()
        if(!document.querySelector('#popup-es-style')) document.head.append(style)
        
      })
  
      popupes.then(loader => new loader.default())
  
  }

  render(opt = {}) { 
    this.template = document.createElement('section')
    this.template.style.fontSize = '0.9em'
    this.template.style.marginBottom = '40px'
    // custom classes
    if(opt.class) this.template.classList.add(...opt.class.split(' '))
    // template
    this.template.innerHTML = `
      <style>${style.toString()}</style>
      <article style="background:rgba(250,250,250,0.3);padding:20px;box-shadow:0px 0px 5px rgba(200,200,200,0.2);border:1px solid #f3f3f3;" class="row w-100">
        <section class="col-8">
          <p>
            <b><i class="material-icons md-18 circle-marker small">shopping_basket</i> ${opt.name} </b><br/>
            Deadline : ${opt.deadline} 
          </p>
        </section>
        <section class="col-4 float-right text-right">
          ${this.opt.menus.indexOf('update')!=-1 ? `<button class="btn btn-sm btn-light" onclick="window.location.hash='/bids/forms/registration/${opt.id}/step/2/update'">Update</button>` : '' }
          ${this.opt.menus.indexOf('remove')!=-1 ? `<button class="btn btn-sm btn-dark remove-particular-modal-btn" data-target="#general-modal" data-popup-toggle="open">Remove</button>` : ''}
        </section>
       
        <section class="col-12">
          <hr/>
          <p>
            <span class="badge badge-danger">${opt.requirements.length}</span> <span class="text-danger">Requirements &emsp;
            ${this.opt.menus.indexOf('add')!=-1 ? `<u class=""><a href="#/bids/forms/registration/${opt.id}/step/3">Add New</a></u></span>` : '' }
          </p>
          <section class="requirements-items-section" id="item-${this.__timestamp}"></section>
          <br/>
        </section>
      </article>
      
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
          amount: new Intl.NumberFormat('en-us').format(el.budget_amount),
          deadline: el.deadline,
          funds: el.funds,
          awarded: el.awardees.length,
          quantity: el.quantity,
          unit: el.unit,
          menus: (this.opt.menus.indexOf('remove')!=-1) ? ['update', 'remove'] : []
        }))
      })

      this.__loadPopup()
    })

    this.__bindListeners()

    // start rendering
    return this.template
  }
}
