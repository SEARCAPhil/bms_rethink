const BiddingServ = import('../../../services/bidding-req-service')

export default class {
  constructor(opt) {
    this.opt = opt
    this.bind()
  }

  hideSpinner () {
    const targ = document.querySelector('#bids-info-container > .spinner')
    if (targ) targ.hide()
  }

  success() {	
    const root = this.opt.root || document
    // close popup
    document.getElementById('general-modal').close()
    root.querySelector(this.opt.selector).parentNode.parentNode.remove()
    this.hideSpinner()
  }

  error (err = '') {
    alert('Unable to remove this bidding request! Please try again later')
    // close popup
    document.getElementById('general-modal').close()
    console.log(err)
    this.hideSpinner()
  }

  async remove () {
    const serve =  (await BiddingServ).default
    const __payload  = {
      id: this.opt.id,
      action: 'remove',
      token : window.localStorage.getItem('token'),
    }

    // spinner
		import('../../../components/app-spinner').then(loader => {
			return new loader.default().show({target: '#bids-info-container'}).then(t => t.template.show())
    })

    // remove from DB
    return new serve().remove(__payload).then(res => { console.log(res)
      return res.data === 1 ?  this.success() : this.error()
    }).catch(err => this.error(err))
  }

  load (e) {
    import('../../remove-conf-modal').then(res => {

      const __proto = Object.assign({ __proto__: this.__proto__ }, this)
      // DOM
      const __target = document.querySelector('#general-modal  > .content > .body')

      __target.innerHTML = res.template
      // close button
      __target.querySelector('#modal-dialog-close-button').addEventListener('click', document.querySelector('#general-modal').close)

      // remove button
      document.getElementById('modal-dialog-remove-button').addEventListener('click', this.remove.bind(__proto))
    })
  }

  bind () {
    const proto = Object.assign({ __proto__: this.__proto__ }, this)
    const root = this.opt.root || document
    root.querySelector(this.opt.selector).addEventListener('click',this.load.bind(proto))
  }
  
}