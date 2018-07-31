
export default class {
  constructor(opt = {}) {
    this.__info = {}
    this.opt = opt
    return this.loadDialog()
  
  }

  
  loadPopup () {
    
    const popupes = import('../../components/popup-es')
    const popupesStyle = import('../../components/popup-es/style')

    popupesStyle.then(css => {
      const style = document.createElement('style')
      style.id = 'popup-es-style'
      style.innerHTML = css.default.toString()
      if(!document.querySelector('#popup-es-style')) document.head.append(style)
    })

    popupes.then(loader => { 
     const a = new loader.default()
    })
 
  }

  /**
   * Attachment Components
   */
  loadAttachments (target, data) { 
    import('../proposal-attachments-item').then(res => {
      const targ = document.querySelector(target)
      if (!targ) return 0
      
      // append files
      data.forEach((val ,index) => { 
        val.menus = ['remove']
        // class
        val.class = "col-lg-12 col-12"
        targ.append(new res.default(val))
      })
      import('../../utils/dropdown-loader').then(loader =>  loader.default('device-dropdown'))
    })
  }


  async loadDialog () { 
    const __proto = Object.assign({__proto__: this.__proto__}, this)
    const dialog = (await import('../../components/dialog-pane')).default
    this.__info = await this.__getInfo(this.opt.id)

    //this.__info = await this.__getInfo(this.opt.id)
    return new dialog(this.opt).then(res => {
      // open dialog pane
      res.open()
      this.render()

      // attach to DOM
      const sec = document.querySelector(`#${res.id} > .body`)
      
      sec.innerHTML = ''
      sec.append(this.template)
    })
  }

    /**
   * Get bidding information via built-in bidding services
   * 
   * @param {int} id 
   */
  __getInfo (id) {
    // fetch details
    return new Promise((resolve, reject) => {
      import('../../services/bidding-proposal-service').then(loader => {
        const a = new loader.default().view({ id, token: localStorage.getItem('token') }).then(res => {
          resolve(res[0])
        }).catch(err => reject(err))
      })
    })
  }

  /**
   * Assign information to scoped data
   */
  async getInfo() {
    if(!this.__info.id) {
      await this.__getInfo(this.__params.id).then(data => {
        this.__info = data
      })
    }
  }

  getMenu() {
    return import('../proposal-menu').then(loader => {
      return new loader.default({
        id: this.opt.id,
        menus: ['send', 'attach', 'remove', 'update']
      }).then(res => {
        const __targ = this.template.querySelector('#prop-info-menu')
        __targ.innerHTML = ''
        __targ.append(res)
      })
    })
  }

  __bindListeners () {
    this.template.querySelector(`#file-attachment-main-dialog-cancel-btn-${this.opt.id}`).addEventListener('click', () => {
      document.querySelector(`#file-attachment-main-dialog-${this.opt.id}`).close()
    })

    this.getMenu().then(() => this.loadPopup ())
   
    this.loadAttachments('.recently-attached-prop-section', this.__info.attachments)
    
  }



  render() { 
    this.template = document.createElement('section')
    this.template.classList.add('row', 'col-12')
    this.template.style.overflowY = 'auto'
    this.__specs = ''

    let __classMarker = ''

    this.__info.specs.map(el => {
      // show old value
      if (((el.name != el.orig_name) || (el.value != el.orig_value)) && (el.orig_value)) __classMarker = 'text-danger'

      this.__specs+= `<div class="col-3 ${__classMarker}">
        <b>${el.name}</b>
      </div>
      <div class="col-9 ${__classMarker}">
        <p>${el.value}</p>
      </div>`
      
    })
    // custom classes
    if(this.opt.class) this.template.classList.add(...this.opt.class.split(' '))
    
    // template
    this.template.innerHTML = `
    <div class="col-5" style="border-right: 1px solid rgba(200,200,200,0.5);padding-top: 100px;">
      <ul class="list-unstyled">
        <li data-role="none">
            <h5 class="text-center">
              <i class="material-icons md-48 text-muted">computer</i>
            </h5>
           
              <h2 id="prop-info-name" class="text-center">${this.__info.name}</h2>

              <small>
                <p class="text-danger text-center"><b>Quantity : </b> <span class="prop-info-quantity">${this.__info.quantity}</span> <span class="prop-info-unit">${this.__info.unit}</span></p>
              </small>
         
          </li>
          
          <li class="nav-item col-12" style="border-bottom:1px solid #ccc;padding-top:5px;padding-bottom:5px">

              <div class="col-12">
                <div class="text-center" style="float:left;width:35px;height:35px;border-radius:50%;margin-left:45%;overflow:hidden;background:#42403c;color:#fff;padding-top:5px" id="prop-info-name-header-section">${this.__info.username.substr(0,2).toUpperCase()}</div>
              </div>
            <div class="col-12 text-center">
              <small><p class="prop-info-username">${this.__info.username}<br><span class="text-muted prop-info-date-created">${this.__info.date_created}</span></p></small>
            </div>
          </li>
      </ul>
    </div>
        <div class="col-7" style="padding-top: 60px;overflow-y:auto;">
            <div class="col-lg-12" style="height: 70vh;">
                <p>Your Proposal <i class="material-icons">navigate_next</i> <span class="text-muted">Preview</span>
                  <span id="file-attachment-main-dialog-cancel-btn-${this.opt.id}" class="float-right text-muted"><u>close (x)</u></span>
                </p>
      
                <!-- menu-->
                <small class="col-12" id="prop-info-menu-status"></small>

                <section  id="prop-info-menu">
                  <ul class="nav">
                    <li class="nav-item row">
                      <a class="nav-link send-prop-modal-btn" href="#" data-target="#bidding-modal" data-popup-toggle="open" data-resources="${this.opt.id}"><i class="material-icons md-18">send</i> Send </a>
                    </li>
                    <li class="nav-item file-prop-attachment-dialog-btn">
                      <a class="nav-link">
                        <i class="material-icons md-18">attach_file</i> Attach
                      </a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link nav-link remove-prop-modal-btn" href="#" data-target="#bidding-modal" data-popup-toggle="open" data-resources="${this.opt.id}">
                        <i class="material-icons md-18">remove_circle_outline</i> Remove
                      </a>
                    </li>


                    <li class="nav-item">
                      <a class="nav-link nav-link proposal-reg-dialog-btn-update" href="#" onclick="event.preventDefault();">
                        Update
                      </a>
                    </li>


                  </ul>
                </section>
               
                <div class="recently-attached-prop-section" id="recently-attached-prop-section-${this.opt.id}"></div>
            <div>
            <br/>
                    <section class="col-12">
      <h2 class="text-danger"><span id="prop-info-currency">${this.__info.currency}</span>: <span id="prop-info-amount">${new Intl.NumberFormat('en-us', {maximumSignificantDigits:3}).format(this.__info.amount)}</span></h2
      <small>
        <p><b>DISCOUNT : <span id="prop-info-discount">${new Intl.NumberFormat('en-us', {maximumSignificantDigits:3}).format(this.__info.discount)}</span></b></p>
      </small>

      <div class="col-12 attachment-prop-pool-section row" id="attachment-prop-pool-section"></div>
      <hr/>
        <h5>
          <span class="header-circle"><i class="material-icons md-24">add_shopping_cart</i></span>
          Specification
        </h5><br>	

      <div class="prop-specs-section-info d-flex row">
        ${this.__specs}
      </div>
    </section>
    <br/><br/>
    <section class="col-12">
      <p><b>Remarks</b></p><br/>
      <p  id="prop-info-remarks" class="text-muted">${this.__info.remarks}</p>	
    </section>

                </div> 
            </div>
        </div>
    </section>
     `
    this.__bindListeners()
    // start rendering
    return this.template
  }
}
      
      
      