import style from './style'


const suppServ = import('../../services/supplier-account-service')

export default class {
  constructor (params) {
    this.__opt = params
    this.DEACTIVATED = 2
    this.ACTIVE = 0
  }

  __notifyEmptyProfile () {
    alert('Sorry! Please try again another profile')
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

  __getInfo () {
    return new Promise ((resolve, reject) => {
      suppServ.then(res => {
        const __payload = {
          id: this.__opt.id,
          token: window.localStorage.getItem('token'),
        }

        new res.default().view(__payload).then(d => {
          resolve(d)
        }).catch(e => reject(e))

      })
    })
  }


  __getSummary () {
    return new Promise ((resolve, reject) => {
      suppServ.then(res => {
        const __payload = {
          id: this.__opt.id,
          token: window.localStorage.getItem('token'),
        }

        new res.default().viewSummary(__payload).then(d => {
          resolve(d)
        }).catch(e => reject(e))

      })
    })
  }



  loadSessionsSection () {
    const __target = this.template.querySelector('#account-ajax-section')
    import ('../account-sessions-section').then(res => {
      return new res.default(this.__opt).then(html => {
        __target.innerHTML = ''
        __target.append(html)
      })
    })
  } 

  loadActivitySection () {
    const __target = this.template.querySelector('#account-ajax-section')
    import ('../account-activity-section').then(res => {
      return new res.default(this.__opt).then(html => {
        __target.innerHTML = ''
        __target.append(html)
      })
    })
  } 

  async loadInfoSection () {
    const __target = this.template.querySelector('#account-ajax-section')
    this.__summary= await this.__getSummary()

    __target.innerHTML = `
      <section class="row">
        <div class="col-12">
          <h5>Summary</h5><hr/>
        </div>
        <div class="card col-lg-3 col-md-3 col-12 mr-3 mb-3">
          <div class="card-body">
            <h5 class="card-title mb-2">
              <div class="row">
                <div class="col-4 pl-1"><div class="float-left mr-1 text-center p-2 pt-3" style="width: 65px; height: 65px; border-radius: 50%; border: 2px solid #ffbd05;">${this.__summary.data.session_total}</div></div>
                <div class="col-8 pl-3">
                  Session
                  <h6 class="card-subtitle mb-2 text-muted">Auth Records</h6>
                </div>
              </div>
              
            </h5>

            
            <p class="card-text">Number of times you login your account in the system</p>
            <a href="#/suppliers/accounts/${this.__info.data[0].account_id}/sessions" class="card-link">View Sessions</a>
          </div>
        </div>

        <div class="card col-lg-3 col-md-3 col-12 mr-3 mb-3">
          <div class="card-body">
            <h5 class="card-title">
              <div class="row">
                <div class="col-4 pl-1"><div class="float-left mr-1 text-center p-2 pt-3" style="width: 65px; height: 65px; border-radius: 50%; border: 2px solid #8BC34A;">${this.__summary.data.bidding_logs_total}</div></div>
                <div class="col-8 pl-3">
                  Activities
                  <h6 class="card-subtitle mb-2 text-muted">Track events</h6>
                </div>
              </div>  
            </h5>
            
            <p class="card-text">Total number of actions you have made</p>
            <a href="#/suppliers/accounts/${this.__info.data[0].account_id}/activities" class="card-link">Go to activities</a>
          </div>
        </div>

        <!-- status -->
        <div class="col-12 mt-4">
          <h5>Registration Status</h5><hr/>
          ${this.__info.data[0].uid ? `<span class="text-success">Connected to Microsoft Ofiice365 Account <i class="material-icons">check_circle</i></span>` : 'Standard Account'}

        </div>
      </section>
    `
  } 

  async loadInfo () {
    const __targ = this.template.querySelector('suppliers-section-container')
    const __temp = document.createElement('section')

    this.__info = await this.__getInfo()

    if (!this.__info.data[0]) return this.__notifyEmptyProfile ()

    __temp.classList.add('col', 'col-lg-10', 'offset-lg-1')
    __temp.innerHTML = `
    <div class="media">
      <img class="mr-3" src="assets/img/user.png" alt="image" style="max-width:80px;">
      <div class="media-body">
        <h5 class="mt-0">${this.__info.data[0].profile_name}</h5>
          <small class="text-muted p-0">
            ${this.__info.data[0].department || 'Department Unavailable'} (${this.__info.data[0].department_alias || 'N/A'})<br/>
            ${this.__info.data[0].position}<br/>
            <i class="material-icons md-12">email</i> ${this.__info.data[0].username || 'N/A'}<br/>
          </small>
          <hr/>
          ${this.__info.data[0].uid ? `<img src="assets/img/office-365.jpg" width="150px"/>` : 'Standard Account'}
          
          ${this.__info.data[0].status == this.ACTIVE ? `<button class="btn btn-sm btn-dark">ACTIVATED</button>` : ''}

          ${this.__info.data[0].status == this.DEACTIVATED ?
            `<button class="btn btn-sm btn-danger">BLOCKED</button> <small>Go to settings to unblock this account</small>`
            : '' }

        </div>
    </div>
    <div class="col-12 mt-5" id ="account-ajax-section"></div>`


    __targ.innerHTML = ''
    __targ.append(__temp)
  }

  __bindListeners() {
    this.__opt.active == 'info' ? this.loadInfo().then(() => this.loadInfoSection()) : ''
    this.__opt.active == 'sessions' ? this.loadInfo().then(() => this.loadSessionsSection()) : ''
    this.__opt.active == 'activities' ? this.loadInfo().then(() => this.loadActivitySection()) : ''
    setTimeout(() => this.__loadPopup() ,1000);
  }

  /**
   * Return template as HTMLObject to be rendered in DOM
   */
  async render () {
    this.template = document.createElement('section')
    // template settings
    this.template.setAttribute('style', 'margin-top:45px;padding-bottom:40px;height:100vh;overflow-y:auto;')
    this.template.classList.add('col-lg-12')
    this.template.id = 'supplier-section'
    this.template.innerHTML = `
      <style>${style.toString()} </style>
      <section>
        <account-info-menu></account-info-menu>
        <br/><br/>
        <suppliers-section-container></suppliers-section-container>
      </section>`

    this.showMenu({
      id: this.__opt.id,
      target: this.template.querySelector('account-info-menu'),
      menus: ['back', 'info', 'sessions', 'activities', 'settings'],
      active: this.__opt.active || 'info'
    })

    this.__bindListeners()
    return this.template
  }

    /**
   * Show menu based on payload
   * 
   * @param {Object} opt 
   */
  showMenu (opt) {
    return new Promise((resolve, reject) => {
      import('../../components/account-info-menu').then(res => {
        return new res.default(opt).then((html) => {
          const targ = opt.target
          if (targ) {
            targ.replaceWith(html)
          } else { 
            document.querySelector('#account-info-menu').replaceWith(html)
          }
          resolve()
        })
      })
    }) 
  }
}
