const infoMenu = import('../../components/bidding-info-menu')
const infoStatus = import('../../components/bidding-status')
const info = import('../../services/bidding-list-service')
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
    
    // reviewed by
    let arr = this.__info.collaborators.map(val => {
      return `<span class="badge badge-dark">${val.profile_name}</span>`
    })
    // template settings
    template.setAttribute('style', 'margin-top:50px;padding-bottom:40px;height:100vh;overflow-y:auto;')
    template.classList.add('col-lg-10')
    template.id = 'bids-info-container'
    template.innerHTML = `
      <section id="detail-info-menu-status" class="w-100"></section>
      <section>
        <bidding-info-menu></bidding-info-menu>
        <!-- attachment upload preview -->
        <div class="col-lg-11 col-sm-12 offset-lg-1 row attachment-pool-section" style="padding-top:10px"></div>

        <article class="col-10 offset-lg-1 mt-5" id="bidding-info-details">
          <!-- info -->
          <h3><b>Bidding Request <span id="bidding-number-info">#${this.__info.id}</span></b></h3>
          <span class="text-danger">Bidding Exemption : ${parseInt(this.__info.excemption) ? 'Yes' : 'No'}</span><br/>
          <p>Reviewed By : ${arr.join(' ')} </p>

          <!-- author -->
          <section style="font-size:0.75em;">
            <div>
              <div class="text-center" style="float:left;width:35px;height:35px;border-radius:50%;margin-right:10px;overflow:hidden;background:#6c757d;color:#fff;padding-top:5px;font-size:1.3em" id="image-info-section">${this.__info.profile_name.substring(0,2).toUpperCase()}</div>
              <p>
                <span><b id="bidding-created-by-info">${this.__info.profile_name}</b></span><br>
                <span class="text-muted" id="bidding-date-created">${this.__info.date_created}</span>
              </p>
            </div>
          </section>

          <!-- attachments -->
          <br/>
          <h6>Attachments</h6>
          <section class="attachments-info-section row"></section>

          <!-- particulars -->
          <br/><br/>
          <h6>Particulars</h6>
          <hr/>
          <section class="particulars-section"></section


          <!-- Reviews -->
          <br/><br/>
          <h6>Customer Reviews</h6>
          <hr/>
          <section class="reviews-section"></section

        </article>
      </section>`
    this.template = template
    return template
  }

  async __bindListeners (loader, template) { 
    const __proto = Object.assign({ __proto__: this.__proto__ }, this)

    // request for approval
    if (this.__info.status == 1 && loader.isCBAAsst()) {
      const __serv = (await import('../../components/bidding-info-menu/actions/approve')).default
      return new __serv({ id: this.__info.id, selector: '#btn-approve'})
      
    }

    
    if (this.__info.status == 3  && loader.isCBAAsst()) {
      // close request
      const __serv = (await import('../../components/bidding-info-menu/actions/close')).default
      const __c = new __serv({ id: this.__info.id, selector: '#btn-close'})
      // failure of bidding
      const __servF = (await import('../../components/bidding-info-menu/actions/fail')).default
      const __f = new __servF({ id: this.__info.id, selector: '#btn-fail'})
    }


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

  /**
   * Attachment Components
   */
  async getAttachments() { 
    const loadAttachments = (await import('./actions')).loadAttachments
    // prevent deletion for already closed bidding
    if(this.__info.status == 5) this.__info.attachments.map(t => {
      return t.locked = true
    })

    return loadAttachments('.attachments-info-section', this.__info.attachments)
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
          const targ = document.querySelector('bidding-info-menu')
          if (targ) {
            targ.replaceWith(html)
          } else { 
            document.querySelector('#detail-info-menu').replaceWith(html)
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
      menus: [], 
    }

    // draft (For all users)
    if (this.__info.status == 0) {
      this.__payload = {}
      this.__payload_menu = {
        id: this.__params.id,
        menus: ['send', 'attach', 'remove', 'update', 'particulars', 'print', 'sign']
      }
    } 

    // for regular USER
    if (this.__info.status == 1 && !loader.isCBAAsst()) this.__payload = status.showBiddingReqSent(this.__info.id)
    
    // for CBA Asst /APPROVE
    if (this.__info.status == 1 && loader.isCBAAsst()) {
      this.__payload_menu = {
        id: this.__params.id,
        menus: ['return', 'attach', 'update', 'sign', 'particulars'],
      }

      this.__payload = status.showBiddingReqApprove(this.__info.id)
    } 
    
    // for both
    // must change to send to resend
    if (this.__info.status == 2) (this.__payload_menu.menus = ['resend', 'attach', 'update', 'print', 'sign', 'particulars']) | (this.__payload = status.showBiddingReqReturned(this.__info.id))

    if (this.__info.status == 3  && loader.isCBAAsst()) (this.__payload_menu.menus = ['resend', 'attach', 'print', 'sign', 'particulars']) |  (this.__payload = status.showBiddingApproved(this.__info.id))

    // for GSU
    // enable all commands
    if (this.__info.status == 3  && (loader.isGSU() || !loader.isCBAAsst())) this.__payload = status.showBiddingApproveReadOnlyStandard(this.__info.id)

    // closed
    if (this.__info.status  == 5) { 
      this.__payload = status.showBiddingClosed(this.__info.id) 
      this.__payload_menu.menus = ['print']
    }

    // disapproved
    if (this.__info.status == 6) this.__payload = status.showBiddingDisapproved(this.__info.id)
      
    // failed
    if (this.__info.status == 6) this.__payload = status.showBiddingFailed(this.__info.id)

  }

  /**
   * Render Status in DOM
   * 
   * @param {Object} payload 
   */
  getStatus(payload) {
    // render
    return new Promise((resolve, reject) => {
      if (this.__info.status > 0) {
        infoStatus.then(res => { 
          return new res.default(this.__payload).then(html => { 
            const a = (!document.querySelector('#bidding-status')) ? document.querySelector('#detail-info-menu-status').prepend(html) : document.querySelector('#bidding-status').replaceWith(html)
            resolve(html)
          })
        })
      } else {
        // remove
        const a = (!document.querySelector('#bidding-status')) ? document.querySelector('#detail-info-menu-status').innerHTML = '' : document.querySelector('#bidding-status').innerHTML = ''
        resolve({})
      }

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
      })
    })
  }

  getParticulars () {
    import('../../components/particulars-item').then(res => {
      const targ = document.querySelector('.particulars-section')
      this.__info.particulars.forEach((el, index) => {
        targ.append(new res.default({id: this.__info.id, name: el.name, deadline: el.deadline, requirements: el.requirements}))
      })
    })
  }
}


export { template }