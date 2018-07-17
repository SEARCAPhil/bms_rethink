import { showError } from '../../../pages/bidding-reg-form/actions';

const BiddingServ = import('../../../services/bidding-list-service')
const AccServ = import('../../../services/accounts')

export default class {
  constructor(opt){
    this.opt = opt
    this.opt.token = window.localStorage.getItem('token')
    this.sendingList = []
    return this.__bindClose()
  }

  __showError () {
    alert('Oops! Unable to resend this request. Please try again later.')
  }

  async close(e) {
    const __serv = (await BiddingServ).default
    const __payload = {
      id: this.opt.id,
      status: 5,
      token : window.localStorage.getItem('token')
    }
    return new __serv().status(__payload).then(res => {
      return res.data ? window.location.reload() : this.__showError()
    }).catch(err => this.__showError())
  }

	loadClose (e) {
    const __proto = Object.assign({ __proto__: this.__proto__ }, this)
    return import('../../close-modal').then(loader => { 
      const __target = document.querySelector('#general-modal > .content > .body')
      __target.innerHTML = loader.template
      __target.querySelector('#modal-dialog-send-button').addEventListener('click', this.close.bind(__proto))
      __target.querySelector('#modal-dialog-close-button').addEventListener('click', () => document.querySelector('#general-modal').close())
    })
  }

  __bindClose () {
    const __proto = Object.assign({ __proto__: this.__proto__ }, this)
		const el = document.querySelectorAll(this.opt.selector)
		el.forEach((els, index) => {
			els.addEventListener('click',this.loadClose.bind(__proto))
		})
	}


}