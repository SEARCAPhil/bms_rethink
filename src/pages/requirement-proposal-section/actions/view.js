
const BiddingServ = import('../../../services/bidding-list-service')
const AccServ = import('../../../services/accounts')

export default class {
  constructor(opt){
    this.opt = opt
    this.opt.token = window.localStorage.getItem('token')
    this.sendingList = []
    return this.__bind()
  }

  __showError () {
    alert('Oops! Unable to resend this request. Please try again later.')
  }


  loadDialogPane (e) { 
    e.preventDefault()
    return import('../../../components/proposal-dialog').then(loader => {
      return new loader.default({
        target: 'body',
        id: e.target.getAttribute('data-resources')
      })
    })
    
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