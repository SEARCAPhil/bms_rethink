const infoMenu = import('../../components/requirement-menu')
const info = import('../../services/bidding-req-service')
const infoStatus = import('../../components/bidding-status')
const statusMessage = import('../../components/requirement-status')

class template {
  constructor (params) {
    this.__params = params
    this.__info = {}
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

  async __bindListeners (loader, template) { 
  
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

  __loadAdditionalComponents () {
    setTimeout(() => {
      // dropdown
      import('../../utils/dropdown-loader').then(loader =>  loader.default('device-dropdown'))
      this.__loadPopup()
    },2000)
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
   * Return template as HTMLObject to be rendered in DOM
   */
  async render () {
    this.__info = await this.__getInfo(this.__params.id)
    const template = document.createElement('section')
    let __funds = ''
    let __specs = ''
    
    this.__info.funds.map(el => {
      return __funds+=`<span class="badge badge-dark">${el.fund_type} - ${el.cost_center} ${el.line_item}</span> `
    })

    this.__info.specs.map(el => {
      return __specs+=`<div class="col-2"><b>${el.name}</b></div>
      <div class="col-10"><p>${el.value}</p></div> `
    })

    const __price = new Intl.NumberFormat('en-us', {maximumSignificantDigits:3}).format(this.__info.budget_amount)

   // this.__info.specs.forEach(el,)

    // template settings
    template.setAttribute('style', 'background:#fff;margin-top:50px;position:relative;box-shadow:0px 0px 10px rgba(200,200,200,0.4);height:100vh;overflow-y:auto;')
    template.classList.add('col-lg-8')
    template.id = 'requirement-container'
    template.innerHTML = `
    <section id="requirement-menu-status" class="w-100"></section>
    <section>
      <requirement-info-menu></requirement-info-menu>
      <section class="row" style="padding:3px;margin-bottom:40px;" id="detail-info-collaborator">
        <!--recepients-->
        <div class="col-lg-11 col-sm-12 offset-lg-1 row attachment-recepients-section" style="padding-top:10px;"></div>

        <!--attachments-->
        <div class="col-lg-11 col-sm-12 offset-lg-1 row attachment-requirements-pool-section"></div>
      </section>

      <section class="col-lg-10 offset-lg-1">
        <h2 class="req-name">${this.__info.name}</h2>
        <small>
          <p>
              <b>Reference # : </b> <span class="req-reference-number">${this.__info.id}</span><br/>
              <b>Amount : </b>
              <span class="req-currency">${this.__info.budget_currency}</span>
              <b><span class="req-amount text-danger">${__price}</span></b><br/>
              <b>Quantity : </b> <span class="req-quantity">${this.__info.quantity}</span> <span class="req-unit">${this.__info.unit}</span><br/><br/>
              <span class="col-12 row" id="funds-requirements-info-section">${__funds}</span><br/>
              <b>Deadline: </b> <span class="req-deadline text-danger">${this.__info.deadline || 'Not Set'}</span>
          </p>

          <p>
              <!--attachments section -->
              <div class="row" id="attachments-requirements-info-section" style="padding:5px;"></div>
          </p>

          <div class="hide" id="awardees-section">
              <hr/>
              <b>Winning Bidder(s)</b>
              <section class="row" id="awardees-section-list"></section>  
          </div>
        </small>
        <hr/>	
        <h5>
            <span class="header-circle"><i class="material-icons md-24">add_shopping_cart</i></span>
            Specifications
        </h5><br/>	
        <div class="specs-section-info d-flex row">${__specs}</div>
      </section>
    </section>`
    this.template = template
    return template
  }


  /**
   * Show menu based on payload
   * 
   * @param {Object} opt 
   */
  showMenu (opt) {
    return new Promise((resolve, reject) => {
      infoMenu.then(res => {
        return new res.default(opt).then((html) => {
          const targ = document.querySelector('requirement-info-menu')
          if (targ) {
            targ.replaceWith(html)
          } else { 
            document.querySelector('#requirement-info-menu').replaceWith(html)
          }

          resolve()
        })
      })
    }) 
  }


  
  /**
   * Get users privilege via privilege API and assign message per status
   * 
   * @param {Object} loader 
   * @param {Object} status 
   */
  setPayload (loader, status) {
    this.__payload = {}
    this.__payload_menu = {
      id: this.__params.id,
      menus: ['back']
    }

    if(this.__info.awardees.length) this.__payload = status.showAwardedStatus()
    if(this.__info.awardees.length && loader.isCBAAsst()) this.__payload_menu.menus = ['back', 'attach', 'winner']
  }


  /**
   * Render Status in DOM
   * 
   * @param {Object} payload 
   */
  getStatus(payload) {
    // render
    return infoStatus.then(res => {
      return new Promise((resolve, reject) => {
        return new res.default(this.__payload).then(html => { 
          const __targ = document.querySelector('#requirement-menu-status')
          __targ.innerHTML = ''
          __targ.append(html)
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
      this.showMenu(this.__payload_menu).then(() => {
        console.log('show')
        // enable popup
        popupesStyle.then(css => {
          const style = document.createElement('style')
          style.id = 'popup-es-style'
          style.innerHTML = css.default.toString()
          if(!document.querySelector('#popup-es-style')) document.head.append(style)
          
        })
        popupes.then(loader => { 
         const a = new loader.default()
        })
      })
      
      this.getStatus(this.__payload).then(temp => {
        this.__bindListeners(loader, temp)
        // change background
        // hack ONLY
        const __styl = document.createElement('style')
        __styl.innerHTML = `
        .congrats-banner:after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          bottom:0;
          left: 0;
          background:url('assets/img/confetti.png') repeat center;
          z-index:-1;
          opacity:0.15;
        }`
        const __targ = document.getElementById('bidding-status')
        if(this.__info.awardees.length) __targ.append(__styl) | __targ.classList.add('congrats-banner')

        // get recepients
        import('../../components/requirement-recepient-item').then(loader => {
          const __recSection = document.querySelector('.attachment-recepients-section')
          this.__info.recepients.forEach((val, index) => {
            __recSection.append(new loader.default({
              id: val.id,
              name: val.name,
            }))
          })
          
        }).then(() => {
          this.__loadAdditionalComponents() 
        })
      })
    })
  }


}




export { template }