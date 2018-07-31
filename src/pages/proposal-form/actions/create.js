const BiddingServ = import('../../../services/bidding-proposal-service')

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

  	/**
	 * Display a notice to attach their formal quotation before proceeding
	 * @param {Object} e - MouseEvent
	 * @returns XMLHttpRequest
	 */
	__loadProposalAttachmentsNotice () { 
    const proto = Object.assign({ __proto__: this.__proto__ }, this)
    const stat = document.querySelector('#bidding-status')

    import('../../../components/proposal-attachments-notice-modal').then(loader => { 
      const __target = document.querySelector('#general-modal > .content > .body')
      __target.innerHTML = loader.template
      __target.querySelector('#modal-dialog-close-button').addEventListener('click', () => document.querySelector('#general-modal').close())
    }).catch(err=>{
			console.log(err)
		})
    
		//const URL='pages/bidding/modal/proposal-attachments-notice.html'

		// show reload status
		stat.innerHTML = '<center class="col-12" style="background:#007bff;color:#fff;padding:15px;">This bidding requirement has been modified. Please reload this page to see changes <u><a href="#" class="text-danger" onclick="event.preventDefault();window.location.reload();">reload</a><u></center>'

		// close form
		document.querySelector('.file-attachment-main-dialog').close()
    // allow attachment
    /*let btn = document.getElementById('modal-dialog-send-button')
    if (!document.querySelector('.file-prop-attachment-dialog-btn')) {
      btn.classList.add('file-prop-attachment-dialog-btn')
    }
    // autoclose modal
    btn.addEventListener('click', () => {
      document.getElementById('bidding-modal').close()
    })

    window.bms.default.lazyLoad(['./assets/js_native/assets/js/modules/Invitation/Util/AttachmentsModal.js'])*/
	}

  /**
	 * @param {Object} e - MouseEvent
	 */
  async create(e) {
    const __serv = (await BiddingServ).default
    const __proto = Object.assign({ __proto__: this.__proto__ }, this)
    const amount = document.getElementById('proposal-form-amount').value
		const discount = document.getElementById('proposal-form-discount').value
		const remarks = document.getElementById('proposal-form-remarks').value

		let original = []
		let others = []

		document.querySelectorAll('.specs-input-section-orig').forEach((el,index) => {
			const val = el.querySelector('.specs-input-section-value')
			if(val) {
				const id = val.getAttribute('data-resources')
				original.push({id, value: val.value })
			}
		})

		document.querySelectorAll('.specs-input-section-others').forEach((el, index) => {
			const name = el.querySelector('.specs-input-section-name')
			const val = el.querySelector('.specs-input-section-value')
			if (val && name) {
				others.push({name: name.value, value: val.value})
			}
		})

		let __payload = {
			id: this.opt.id,
			amount,
			discount,
			remarks,
			original,
			others,
			token : window.localStorage.getItem('token'),
			action: 'create',
    }
    
    new __serv().create(__payload).then(res => { 
      return res ? this.__loadProposalAttachmentsNotice() : this.__showError()
    }).catch(err => this.__showError() | console.log(err))
  }

	load (e) {
    const __proto = Object.assign({ __proto__: this.__proto__ }, this)
    return import('../../../components/save-modal').then(loader => { 
      const __target = document.querySelector('#general-modal > .content > .body')
      __target.innerHTML = loader.template
      __target.querySelector('#modal-dialog-send-button').addEventListener('click', this.create.bind(__proto))
      __target.querySelector('#modal-dialog-close-button').addEventListener('click', () => document.querySelector('#general-modal').close())
    })
  }

  __bind() {
    const __proto = Object.assign({ __proto__: this.__proto__ }, this)
    const el = document.querySelectorAll(`${this.opt.selector}:not(.event-binded)`)
		el.forEach((els, index) => {
      els.classList.add('event-binded')
			els.addEventListener('click',this.load.bind(__proto))
		})
	}


}