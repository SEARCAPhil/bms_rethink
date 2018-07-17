import { showError } from '../../../pages/bidding-reg-form/actions';

const BiddingServ = import('../../../services/bidding-list-service')
const AccServ = import('../../../services/accounts')

export default class {
  constructor(opt){
    this.opt = opt
    this.opt.token = window.localStorage.getItem('token')
    this.sendingList = []
    return this.__bindReturn()
  }

  __showError () {
    alert('Oops! Unable to process this request. Please try again later.')
  }

  async return(e) {
    const __serv = (await BiddingServ).default
    const __payload = {
      id: this.opt.id,
      status: 2,
      token : window.localStorage.getItem('token')
    }
    return new __serv().status(__payload).then(res => {
      return res.data ? window.location.reload() : this.__showError()
    }).catch(err => this.__showError())
  }

	loadReturn (e) {
    const __proto = Object.assign({ __proto__: this.__proto__ }, this)
    return import('../../send-modal').then(loader => { 
      const __target = document.querySelector('#general-modal > .content > .body')
      __target.innerHTML = loader.template
      __target.querySelector('#modal-dialog-send-button').addEventListener('click', this.return.bind(__proto))
      __target.querySelector('#modal-dialog-close-button').addEventListener('click', () => document.querySelector('#general-modal').close())
    })
  }

  __bindReturn () {
    const __proto = Object.assign({ __proto__: this.__proto__ }, this)
		const el = document.querySelectorAll(this.opt.selector)
		el.forEach((els, index) => {
			els.addEventListener('click',this.loadReturn.bind(__proto))
		})
	}


}