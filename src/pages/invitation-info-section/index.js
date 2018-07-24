const infoMenu = import('../../components/bidding-info-menu')
const infoStatus = import('../../components/bidding-status')
const info = import('../../services/bidding-inv-service')
const statusMessage = import('../../components/status-message')

class template {
  constructor (params) {
    this.__params = params
    this.__info = {}
  }

  /**
   * Return template as HTMLObject to be rendered in DOM
   */
  async render () {
    this.__info = await this.__getInfo(this.__params.id)
    const template = document.createElement('section')
    
    // template settings
    template.setAttribute('style', 'margin-top:50px;padding-bottom:40px;height:100vh;overflow-y:auto;')
    template.classList.add('col-lg-10')
    template.id = 'inv-info-container'
    template.innerHTML = `
    <section class="row" style="background:#fff;margin-top:50px;margin-bottom:5px;box-shadow:0px 0px 5px rgba(200,200,200,0.5);padding:4px;">
    <small class="col-12" id="detail-req-menu-status"></small>
    <small class="col-lg-11 offset-lg-1">
      <ul class="nav">
        <li class="nav-item">
            <a href="#" onclick="event.preventDefault()" class="nav-link send-requirements-modal-btn hide" data-target="#bidding-requirements-modal" data-popup-toggle="open">
                <i class="material-icons md-18">insert_invitation</i> Send Invitation
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link text-muted">
                Hooray! You are invited to bid on this product. Please review the details before sending a proposal
            </a>
        </li>
        <li class="nav-item text-muted">
            <a class="nav-link proposal-requirement-dialog-btn">
                <i class="material-icons md-18">message</i>
            </a>
        </li>
      </ul>
    </small>
  </section>
  
  <section class="row" style="padding:3px;margin-bottom:40px;" id="detail-info-collaborator">
      <!--recepients-->
      <div class="col-lg-11 col-sm-12 offset-lg-1 row attachment-recepients-section" style="padding-top:10px;"></div>

      <!--attachments-->
      <div class="col-lg-11 col-sm-12 offset-lg-1 row attachment-requirements-pool-section"></div>
  </section>
  
  <section class="col-lg-10 offset-lg-1">
    <h2 class="req-name"></h2>
    <small>
        <p>
          <b>Bidding Item #: </b> <span class="req-bidding-number">Not Set</span> <br/>
          <b>Reference #: </b> <span class="req-reference-number">Not Set</span> <br/>
          <span class="text-danger"><b>Quantity : </b> <span class="req-quantity"></span> <span class="req-unit"></span></span> <br/>
          <b>Deadline: </b> <span class="req-deadline">Not Set</span>
        </p><br/>

        <p>
          <b>Attachments</b>
          <section class="row">
              <div class="col-lg-3 text-center">
                      <a href="#" target="_blank" class="price-inquiry-btn text-secondary">
                          <img src="assets/img/pdf.png" width="70"/><br/>
                          Price Inquiry.pdf
                      </a>
              </div>
              <div class="col-lg-3 text-center">
                  <a href="#" target="_blank" class="price-inquiry-current-btn text-secondary">
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
    </small>
    <hr/>	
    <h5>
      <span class="header-circle"><i class="material-icons md-24">add_shopping_cart</i></span>
      Specification
    </h5><br/>	
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
          resolve(res.data[0])
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

}


export { template }