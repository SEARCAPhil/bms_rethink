const Network =  import('../../config/api') 
const infoMenu = import('../../components/bidding-info-menu')
const infoStatus = import('../../components/bidding-status')
const info = import('../../services/bidding-inv-service')
const statusMessage = import('../../components/status-inv-message')

class template {
  constructor (params) {
    this.__params = params
    this.__info = {}
  }

  __loadProposalSection () {
    // load proposal section
    return import('../../pages/requirement-proposal-section').then(res => {
      // template
      const temp = new res.default({id: this.__info.id})
      temp.then(html => { 
        // DOM
        const reqSec = document.querySelector('proposal-section') || document.querySelector('#requirement-proposal-container')
        if(reqSec) reqSec.replaceWith(html) 
      })
    })
  }

  /**
   * Return template as HTMLObject to be rendered in DOM
   */
  async render () {
    const net = (await Network).default
    const template = document.createElement('section')
    let __specs = ''
    let __attachments = ''
    this.__info = await this.__getInfo(this.__params.id)
    // specs
    this.__info.specs.map(el => {
      return __specs+=`<div class="col-2"><b>${el.name}</b></div>
      <div class="col-10"><p>${el.value}</p></div> `
    })
    //attachments
    this.__info.attachments.map(el => {
      return __attachments+=`<div class="col-lg-3 text-center">
        <a href="#" target="_blank" class="price-inquiry-btn text-secondary">
          <img src="assets/img/pdf.png" width="70"><br>
          ${el.original_filename}
        </a>
      </div>`
    })
    

    // template settings
    template.setAttribute('style', 'margin-top:50px;padding-bottom:40px;height:100vh;overflow-y:auto;')
    template.classList.add('col-lg-8')
    template.id = 'inv-info-container'
    template.innerHTML = `
    <section id="detail-info-menu-status" class="w-100"></section>
    <section class="row" style="background:#fff;margin-bottom:5px;box-shadow:0px 0px 5px rgba(200,200,200,0.5);padding:4px;"></section>
  
    <section class="row" style="padding:3px;margin-bottom:40px;" id="detail-info-collaborator">
        <!--recepients-->
        <div class="col-lg-11 col-sm-12 offset-lg-1 row attachment-recepients-section" style="padding-top:10px;"></div>
        <!--attachments-->
        <div class="col-lg-11 col-sm-12 offset-lg-1 row attachment-requirements-pool-section"></div>
    </section>
    
    <section class="col-lg-10 offset-lg-1">
      <h2 class="req-name">${this.__info.name}</h2>
      <small>
        <!-- details -->
        <p>
          <b>Bidding Item #: </b> <span class="req-bidding-number">${this.__info.bidding_id}</span> <br/>
          <b>Reference #: </b> <span class="req-reference-number">${this.__info.id}</span> <br/>
          <span class="text-danger"><b>Quantity : </b> <span class="req-quantity">${this.__info.quantity}</span> <span class="req-unit">${this.__info.unit}</span></span> <br/>
          <b>Deadline: </b> <span class="req-deadline">${this.__info.deadline}</span>
        </p><br/>

        <!-- attachments-->
        <p>
          <b>Attachments</b>
          <section class="row">
            <div class="col-lg-3 text-center">
            <a href="${net.url}/bidding/reports/price_inquiry_per_item.php?id=${this.__info.id}&token=${window.localStorage.getItem('token')}" target="_blank" class="price-inquiry-btn text-secondary">
              <img src="assets/img/pdf.png" width="70"/><br/>
              Price Inquiry.pdf
            </a>
          </div>
          <div class="col-lg-3 text-center">
            <a href="${net.url}/bidding/reports/price_inquiry.php?id=${this.__info.id}&token=${window.localStorage.getItem('token')}" target="_blank" class="price-inquiry-current-btn text-secondary">
                <img src="assets/img/pdf.png" width="70"/><br/>
                Price Inquiry (All Items).pdf
            </a>
          </div>
            
          </section>
        </p>
        <p>
          <!--attachments section -->
          <div class="row" id="attachments-requirements-info-section" style="padding:5px;"></div>
        </p>
      </small><hr/>	

      <!-- specs -->
      <h5>
        <span class="header-circle"><i class="material-icons md-24">add_shopping_cart</i></span>
        Specification
      </h5><br/>
      <section class="row">${__specs}</section>	
      <div class="specs-section-info d-flex row"></div>
    </section>`
    this.template = template
    return template
  }



  async __bindListeners (loader, template) { 
    const __proto = Object.assign({ __proto__: this.__proto__ }, this)
  }

  /**
   * Get bidding information via built-in bidding services
   * 
   * @param {int} id 
   */
  __getInfo (id) {
    // fetch details
    return new Promise((resolve, reject) => {
      info.then(loader => {
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


  /**
   * Get users privilege via privilege API and assign message per status
   * 
   * @param {Object} loader 
   * @param {Object} status 
   */
  setPayload (loader, status) {
    this.__payload = {}

    if (this.__info.status == 0) {
      this.__payload = status.showInitial(this.__info.id)
    }
  }

   /**
   * Render Status in DOM
   * 
   * @param {Object} payload 
   */
  getStatus(payload) {
    // render
    return new Promise((resolve, reject) => {
      infoStatus.then(res => { 
        return new res.default(this.__payload).then(html => { 
          const a = (!document.querySelector('#bidding-status')) ? document.querySelector('#detail-info-menu-status').prepend(html) : document.querySelector('#bidding-status').replaceWith(html)
          resolve(html)
        })
      })
    })
  }

  async setStatus () {  
    const status = await statusMessage
    const popupes = import('../../components/popup-es')
    const popupesStyle = import('../../components/popup-es/style')

    // set menu and payload based on user privilege
    return await import('../../utils/privilege-loader').then(loader => {
      this.privilegeLoader = loader
     
      this.setPayload(loader, status)
      
      this.getStatus(this.__payload).then(temp => {
        //this.__bindListeners(loader, temp)
      })
      this.__loadProposalSection()
    })
  }


}


export { template }