
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
  
  loadPopup () {
    
    const popupes = import('../../popup-es')
    const popupesStyle = import('../../popup-es/style')

    popupesStyle.then(css => {
      const style = document.createElement('style')
      style.id = 'popup-es-style'
      style.innerHTML = css.default.toString()
      if(!document.querySelector('#popup-es-style')) document.head.append(style)
    })

    popupes.then(loader => { new loader.default() })
 
  }

  loadDialogPane (e) { 
    e.preventDefault()
    // dialog
    let opt = Object.assign({}, this.opt)
    opt.id = this.opt.dialogId
    this.__getInfo(this.opt.id).then(res => {
      import('../../proposal-form').then(loader => {
        opt.info = res
        return new loader.default(opt)
      }).then(() => {
        this.loadPopup()      
        import('./update').then(actions => {
          return new actions.default({
            selector: '.save-bidding-modal-btn',
            id: this.opt.id,
          })
        })

      })


    })
  }

  /**
   * Get bidding information via built-in bidding services
   * 
   * @param {int} id 
   */
  __getInfo (id) {
    // fetch details
    return new Promise((resolve, reject) => {
      import('../../../services/bidding-proposal-service').then(loader => {
        const a = new loader.default().view({ id, token: localStorage.getItem('token') }).then(res => {
          resolve(res[0])
        }).catch(err => reject(err))
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