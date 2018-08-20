
const BiddingServ = import('../../../services/bidding-list-service')
const AccServ = import('../../../services/accounts')

export default class {
  constructor(opt){
    this.opt = opt
    this.opt.token = window.localStorage.getItem('token')
    this.sendingList = []
    return this.__bind()
  }

  hideSpinner () {
    const targ = document.querySelector('body > .spinner')
    if (targ) targ.hide()
  }


  __showError () {
    alert('Oops! Unable to resend this request. Please try again later.')
    this.hideSpinner()
  }


  loadDialogPane (e) { 
    e.preventDefault()
    
    // spinner
		import('../../../components/app-spinner').then(loader => {
			return new loader.default().show({target: 'body'}).then(t => t.template.show())
    })

    return import('../../../components/proposal-dialog').then(loader => {
      return new loader.default({
        target: 'body',
        id: e.target.getAttribute('data-resources')
      })
    }).then(() => {
        this.hideSpinner()
      })
    
  }

  /**
   *Bind 
   *
   */
  __bind () {
		const __proto = Object.assign({ __proto__: this.__proto__ }, this)
		const el = document.querySelectorAll(`${this.opt.selector}:not(.event-binded)`)
		el.forEach((els, index) => {
      els.classList.add('event-binded')
			els.addEventListener('click', this.loadDialogPane.bind(__proto))
		})
	}

}