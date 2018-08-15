const BiddingReqServ = import('../../../services/bidding-req-proposal-service')
const statusMessage = import('../../requirement-status')
const infoStatus = import('../../bidding-status')

export default class {
  constructor(opt){
    this.opt = opt
    this.opt.token = window.localStorage.getItem('token')
    this.__timeout = {}
    
    return this.__bind()
  }

  __showError () {
    alert('Oops! Unable to resend this request. Please try again later.')
  }

  /**
	 * Display notification to attach bidding resolution after they awarded a supplier.
	 * @param {Object} e - MouseEvent
	 * @returns XMLHttpRequest
	 */
	loadAwardRequirementsAttachmentsNotice () {

		const __proto = Object.assign({ __proto__: this.__proto__ }, this)
    return import('../../award-attachments-notice-modal').then(loader => { 
      const __target = document.querySelector('#general-modal > .content > .body')
      __target.innerHTML = loader.template
      __target.querySelector('#modal-dialog-send-button').addEventListener('click', () => {
        document.getElementById('general-modal').close()
        // click attachment button
        document.querySelector('.file-prop-attachment-dialog-btn').click()
      })

      statusMessage.then(loader => {
        const __targ = document.querySelector('#prop-info-menu-status')
        __targ.innerHTML = ''
        infoStatus.then(stat => {
          return new stat.default(loader.showModifiedStatus()).then(html => __targ.append(html))
        })
        
      })
    })
	}




  async process(e) {
    const __serv = (await BiddingReqServ).default
    
    const __payload = {
      id: this.opt.id,
			remarks: document.getElementById('award-remarks').value,
			action: 'winner',
			token: window.localStorage.getItem('token')
    }
   
    e.target.disabled = 'disabled'
    return new __serv().send(__payload).then(res => {
      if(!res) return this.__showError ()
      if(parseInt(res) > 0) { 
        return this.loadAwardRequirementsAttachmentsNotice() 
      }
      this.__showError()
    }).catch(err => console.log(err))

  }


	load (e) { 
    const __proto = Object.assign({ __proto__: this.__proto__ }, this)
    return import('../../winner-proposal-modal').then(loader => { 
      const __target = document.querySelector('#general-modal > .content > .body')
      __target.innerHTML = loader.template
      __target.querySelector('#modal-dialog-send-button').addEventListener('click', this.process.bind(__proto))
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