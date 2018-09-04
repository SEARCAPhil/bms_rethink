import style from './style'

export default class {
  constructor (params) {
    this.__opt = params
  }

  __info () {
    const __targ = this.template.querySelector('suppliers-section-container')
    const __temp = document.createElement('section')
    __temp.classList.add('col', 'col-lg-10', 'offset-lg-1')
    __temp.innerHTML = `
    <div class="media">
      <img class="mr-3" src="assets/img/user.png" alt="image" style="max-width:80px;">
      <div class="media-body">
        <h5 class="mt-0">John Mark Doe</h5>
          <small class="text-muted p-0">
            System Administrator<br/>
            jmd@doe.org<br/>
          </small>
          <button class="btn btn-sm btn-dark">ACTIVE</button> <a href="#" class="text-danger">Deactivate</a>
        </div>
    </div>
    <div class="col-12 mt-5">
      <i class="material-icons md-48" style="color:#03A9F4;">cloud</i> <br/> <span class="text-muted">Personal Storage</span>
      <hr/>
    </div>
    
    `

    __targ.innerHTML = ''
    __targ.append(__temp)
  }

  __bindListeners() {
    this.__opt.active == 'info' ? this.__info() : ''
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
