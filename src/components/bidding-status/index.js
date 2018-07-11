import style from './style'

export default class {
  constructor(opt = {}) {
    return this.render(opt) 
  }

  async render(opt = {}) { 
    this.template = document.createElement('section')
    this.template.id = 'bidding-status'
    this.template.classList.add('row')

    // custom classes
    if(opt.class) this.template.classList.add(...opt.class.split(' '))
    
    // template
    this.template.innerHTML = `
      <style>${style.toString()}</style>

      <section class="col-lg-1">${opt.icon}</section>
      <section class="col-lg-8 message">${opt.message}</section>
      <section class="col-lg-3">${opt.actions}</section>
    `
    // start rendering
    return this.template
  }
}
