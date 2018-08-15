import style from '../../components/general-style/circle-marker'
import { resolve } from 'upath';

export default class {
  constructor (opt) {
    this.opt = opt
    this.template = {}
    this.__info = {}
    return this.render() 
  }

  __loadUpdateAction () {
    import('./actions/update').then(loader => {
      let btn = this.template.querySelector('.add-supplier-button')
      btn.addEventListener('click', loader.update)
      btn.id = this.__info.id
      btn.biddingId = this.__info.bidding_id
    })
  }

  __loadCreateAction () {
    import('./actions/create').then(loader => {
      let btn = this.template.querySelector('.add-supplier-button')
      btn.addEventListener('click', loader.register)
      btn.id = this.opt.id
    })
  }
  
  __bindListeners () {
    if (this.opt.action === 'update') this.__loadUpdateAction()
    if (this.opt.action === 'create') this.__loadCreateAction()
  }

  __getInfo() {
    return new Promise((resolve, reject) => {
      import('./actions/update').then(loader => {
       loader.view({
          id: this.opt.id,
          token: window.localStorage.getItem('token')
        }).then(json => resolve(json[0])).catch(err => reject(err))

        //this.template.querySelector('.add-supplier-button').addEventListener('click', loader.update)
      })
    })
  }

  /**
   * Return template as HTMLObject to be rendered in DOM
   */
  async render () {
    this.__info = (await this.__getInfo()) || {}
    
    this.template = document.createElement('section')
    this.template.classList.add('row')
    this.template.innerHTML = `
      <style>${style.toString()}</style>
      <article class="col-xs-12 col-md-12 col-lg-8 offset-lg-2 col-xs-12" style="margin-top: 15vh;overflow:auto;padding-bottom: 30px;">
        <section id="reg-notif-area"></section>
      
        <form class="form-horizontal row" name="bidding-request-particulars" onsubmit="return false;">
          <section class="col-md-12">
              <p>
                <span class="text-info">
                  <h5>
                    <span class="circle-marker" style="width:30px;height:30px;">
                      <i class="material-icons md-24">add_shopping_cart</i>
                    </span>
                    <b>
                      <span style="color:#009688;">Particulars </span> 
                      <small class="text-muted">(Required)</small> 
                    </b>
                  </h5>

                <p class="text-muted"><small>This will help to easily identify what this request is intended for</small></p>
                <input type="text" name="name" class="form-control" id="name" placeholder="e.i. IT Equipment FY 2016-2017" value="${this.__info.name || ''}" required autofocus>
              </p>
              
              <p style="margin-top: 50px;">
                <h5>
                  <span class="circle-marker" style="width:30px;height:30px"><i class="material-icons md-24">date_range</i></span>
                  <span style="color:#009688;"><b>Date needed</b></span>
                </h5>
                <input type="date" name="deadline" class="form-control" id="deadline" value="${this.__info.deadline || ''}">
              </p>
          </section>
          
          <section class="col col-md-12">
            <button class="btn btn-dark add-supplier-button float-right">NEXT <i class="material-icons">navigate_next</i></button>
          </section>
        </form>
      </article>`
    this.__bindListeners()
    return this.template
  }
}
