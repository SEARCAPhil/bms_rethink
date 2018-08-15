const BiddingReqServ = import('../../../services/bidding-req-service')

export default class {
  constructor(opt){
    this.opt = opt
    this.opt.token = window.localStorage.getItem('token')
    this.sendingList = []
    return this.__bindDeadline()
  }

  __showError () {
    alert('Oops! Unable to resend this request. Please try again later.')
  }

  async deadline(e) {
    const __serv = (await BiddingReqServ).default
    const __payload = {
      id: this.opt.id,
      deadline: document.getElementById('deadline').value,
			action: 'create',
      token : window.localStorage.getItem('token')
    }

    e.target.disabled = 'disabled'
    
    return new __serv().deadline(__payload).then(res => {
      return parseInt(res) > 0 ? window.location.reload() : this.__showError()
    }).catch(err => this.__showError())
  }

	loadDeadline (e) {
    const __proto = Object.assign({ __proto__: this.__proto__ }, this)
    return import('../../deadline-modal').then(loader => { 
      const __target = document.querySelector('#general-modal > .content > .body')
      __target.innerHTML = loader.template
      __target.querySelector('#modal-dialog-send-button').addEventListener('click', this.deadline.bind(__proto))
    })
  }

  __bindDeadline () {
    const __proto = Object.assign({ __proto__: this.__proto__ }, this)
		const el = document.querySelectorAll(this.opt.selector)
		el.forEach((els, index) => {
			els.addEventListener('click',this.loadDeadline.bind(__proto))
		})
	}


}