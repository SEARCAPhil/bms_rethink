import { showError } from '../../../pages/bidding-reg-form/actions';

const BiddingServ = import('../../../services/bidding-list-service')
const AccServ = import('../../../services/accounts')

export default class {
  constructor(opt){
    this.opt = opt
    this.opt.token = window.localStorage.getItem('token')
    this.sendingList = []
    return this.__bindResend()
  }

  hideSpinner () {
    const targ = document.querySelector('#general-modal > .spinner')
    if (targ) targ.hide()
  }

  __showError () {
    alert('Oops! Unable to process this request. Please try again later.')
  }

  async resend(e) {
    e.target.disabled = 'disabled'
    e.preventDefault()

    const __serv = (await BiddingServ).default
    const __payload = {
      id: this.opt.id,
      status: 1,
      token : window.localStorage.getItem('token')
    }

    // spinner
		import('../../app-spinner').then(loader => {
			return new loader.default().show({target: '#general-modal'}).then(t => t.template.show())
    })

    return new __serv().status(__payload).then(res => {
      return res.data ? window.location.reload() :  (this.__showError() | this.hideSpinner() | (e.target.disabled = false))
    }).catch(err => (this.__showError()|  this.hideSpinner() | (e.target.disabled = false)))
  }

	loadResend (e) {
    const __proto = Object.assign({ __proto__: this.__proto__ }, this)
    return import('../../send-modal').then(loader => { 
      const __target = document.querySelector('#general-modal > .content > .body')
      __target.innerHTML = loader.template
      __target.querySelector('#modal-dialog-send-button').addEventListener('click', this.resend.bind(__proto))
      __target.querySelector('#modal-dialog-close-button').addEventListener('click', () => document.querySelector('#general-modal').close())
    })
  }

  __bindResend () {
    const __proto = Object.assign({ __proto__: this.__proto__ }, this)
		const el = document.querySelectorAll(this.opt.selector)
		el.forEach((els, index) => {
			els.addEventListener('click',this.loadResend.bind(__proto))
		})
	}


}