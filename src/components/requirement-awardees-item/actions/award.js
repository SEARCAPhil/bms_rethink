const BiddingReqServ = import('../../../services/bidding-req-service')


export default class {
  constructor(opt){
    this.opt = opt
    this.opt.token = window.localStorage.getItem('token')
    this.sendingList = {}
    this.sendingItems = {}
    this.__timeout = {}
    return this.__bind()
  }

  __showError () {
    alert('Oops! Unable to resend this request. Please try again later.')
  }

 
  async process(e) {
    const __serv = (await BiddingReqServ).default
    const __payload = {
      id: this.opt.id,
      action: 'award',
      token: window.localStorage.getItem('token'),
    }
   
    e.target.disabled = 'disabled'
    return new __serv().award(__payload).then(res => {
      if(!parseInt(res)) return
      if(parseInt(res) > 0) return window.location.reload()
      this.__showError()
      
    }).catch(err => console.log(err))

  }


	load (e) {
    const __proto = Object.assign({ __proto__: this.__proto__ }, this)
    return import('../../requirement-award-modal').then(loader => { 
      const __target = document.querySelector('#general-modal > .content > .body')
      __target.innerHTML = loader.template
      __target.querySelector('#modal-dialog-send-button').addEventListener('click', this.process.bind(__proto))
      __target.querySelector('#modal-dialog-close-button').addEventListener('click', () => document.querySelector('#general-modal').close())
    })
  }


  __bind () {
    const __proto = Object.assign({ __proto__: this.__proto__ }, this)
		const el = document.querySelectorAll(this.opt.selector)
		el.forEach((els, index) => {
			els.addEventListener('click',this.load.bind(__proto))
		})
	}


}