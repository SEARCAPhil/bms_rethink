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
            <i class="material-icons md-12">email</i> ${this.__info.data[0].username || 'N/A'}<br/><br/>
          </small>

          ${this.__info.data[0].uid ? `<img src="assets/img/office-365.jpg" width="200px"/>` : ''}
          
          ${this.__info.data[0].status == this.ACTIVE ? `<button class="btn btn-sm btn-dark">ACTIVATED</button>` : ''}

          ${this.__info.data[0].status == this.DEACTIVATED ?
            `<button class="btn btn-sm btn-danger">DEACTIVED</button> <a href="#" class="text-success">Activate</a>`
            : '' }

        </div>
    </div>
    <div class="col-12 mt-5" id ="account-ajax-section"></div>`


    __targ.innerHTML = ''
    __targ.append(__temp)
  }

  __bindListeners() {
    this.__opt.active == 'info' ? this.loadInfo() : ''
    this.__opt.active == 'sessions' ? this.loadInfo().then(() => this.loadSessionsSection()) : ''
    this.__opt.active == 'activities' ? this.loadInfo().then(() => this.loadActivitySection()) : ''
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
