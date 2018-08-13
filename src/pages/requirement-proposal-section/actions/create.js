
export default class {
  constructor(opt){
    this.opt = opt
    this.opt.token = window.localStorage.getItem('token')
    this.sendingList = []
    return this.__bind()
  }

  hideSpinner () {
    const targ = document.querySelector('#inv-info-container > .spinner')
    if (targ) targ.hide()
  }


  __showError () {
    alert('Oops! Unable to resend this request. Please try again later.')
  }


  loadDialogPane () {
    // spinner
		import('../../../components/app-spinner').then(loader => {
			return new loader.default().show({target: '#inv-info-container'}).then(t => t.template.show())
    })
    
    return import('../../proposal-form').then(loader => {
      return new loader.default({
        target: 'body',
        id: this.opt.id
      })
    }).then(() => this.hideSpinner())
    
  }

  /**
   *Bind 
   *
   */
  __bind () {
		const proto = Object.assign({ __proto__: this.__proto__ }, this)
		const el = document.querySelectorAll(this.opt.selector)
		el.forEach((els, index) => {
			els.addEventListener('click',this.loadDialogPane.bind(proto))
		})
	}

}