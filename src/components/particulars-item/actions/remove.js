const BiddingServ = import('../../../services/bidding-part-service')

export default class {
  constructor(opt) {
    this.opt = opt
    this.bindRemove()
  }

  hideSpinner () {
    const targ = document.querySelector('registration-section > .spinner')
    if (targ) targ.hide()
  }

  success() {	
    this.hideSpinner()
    // close popup
    document.getElementById('general-modal').close()
    this.opt.root.querySelector(this.opt.selector).parentNode.parentNode.innerHTML = `
      <center><h4>Content is unavailable. This particular has been removed</h4></center>
    `
  }

  error (err = '') {
    alert('Unable to remove this bidding request! Please try again later')
    // close popup
    document.getElementById('general-modal').close()
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
			return new loader.default().show({target: 'registration-section'}).then(t => t.template.show())
    })
    
    // remove from DB
    return new serve().remove(__payload).then(res => { console.log(res)
      return res.data == 1 ?  this.success() : this.error()
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

  bindRemove() {
    const proto = Object.assign({ __proto__: this.__proto__ }, this)
    const root = this.opt.root || document
    root.querySelector(this.opt.selector).addEventListener('click',this.load.bind(proto))
  }
  
}