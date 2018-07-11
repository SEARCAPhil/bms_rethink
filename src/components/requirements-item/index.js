import style from './style'

export default class {
  constructor(opt = {}) {
    return this.render(opt) 
  }

  render(opt = {}) { 
    this.template = document.createElement('div')
    this.template.classList.add('requirement-item')

    // custom classes
    if(opt.class) this.template.classList.add(...opt.class.split(' '))
    
    // template
    this.template.innerHTML = `
      <style>${style.toString()}</style>
        <b><a href="#/bids/requirements/66"><u>HP Eliteone800</u></a></b> 
        <span>(25 Unit)</span>
        <span class="badge badge-dark">OpF - ITSU - Capital Expenditures</span>
        
        <span class="" style="color:#ffb80c;">
          <i class="material-icons md-18">star</i> 
          <span>Awarded</span>
        </span>
        <span class="float-right text-danger">PHP 1,000,000</span>
      `

    // start rendering
    return this.template
  }
}
