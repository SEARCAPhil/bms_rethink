import { showError } from '../../../pages/bidding-reg-form/actions';

const BiddingServ = import('../../../services/bidding-attachment-service')

export default class {
  constructor(opt) {
    this.opt = opt
    this.bindRemoveAttachments()
  }

  success(id) {	
    // close popup
    document.getElementById('general-modal').close()
    // remove from DOM
    document.querySelector(`#attachments-info-section-${id}`).remove()
  }

  error (err = '') {
    alert('Unable to process this request! Please try again later')
    // close popup
    document.getElementById('general-modal').close()
    console.log(err)
  }

  async removeAttachments (e) {

    e.target.setAttribute('disabled', 'disabled')
    const serve =  (await BiddingServ).default
		const __payload = {
			id: this.opt.id,
			action: 'remove',
			token: window.localStorage.getItem('token'),
    }
    
    // remove from DB
    return new serve().remove(__payload).then(json => {
      return json.data == 1 ?  this.success(__payload.id) : this.error()
    }).catch(err => this.error(err))
  }

  loadRemoveAttachments (e) {
    import('../../remove-conf-modal').then(res => {
      const __proto = Object.assign({ __proto__: this.__proto__ }, this)
      // DOM
      const __target = document.querySelector('#general-modal  > .content > .body')

      __target.innerHTML = res.template
      // close button
      __target.querySelector('#modal-dialog-close-button').addEventListener('click', document.querySelector('#general-modal').close)

      // remove button
      document.getElementById('modal-dialog-remove-button').addEventListener('click', this.removeAttachments.bind(__proto))
    })
  }

  bindRemoveAttachments () {
    const proto = Object.assign({ __proto__: this.__proto__ }, this)
    const root = this.opt.root || document
    root.querySelector(this.opt.selector).addEventListener('click', this.loadRemoveAttachments.bind(proto))
	}
  
}