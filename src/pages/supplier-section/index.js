import style from './style'

class template {
  constructor (params) {
    this.__opt = params
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
        <supplier-section-menu></supplier-section-menu>
        <suppliers-section-container></suppliers-section-container>
      </section>`

    this.showMenu({
      target: this.template.querySelector('supplier-section-menu'),
      menus: ['suppliers', 'register'],
      active: this.__opt.active
    })
    return this.template
  }

    /**
   * Show menu based on payload
   * 
   * @param {Object} opt 
   */
  showMenu (opt) {
    return new Promise((resolve, reject) => {
      import('../../components/supplier-section-menu').then(res => {
        return new res.default(opt).then((html) => {
          const targ = opt.target
          if (targ) {
            targ.replaceWith(html)
          } else { 
            document.querySelector('#supplier-section-menu').replaceWith(html)
          }
          resolve()
        })
      })
    }) 
  }
}


export { template }