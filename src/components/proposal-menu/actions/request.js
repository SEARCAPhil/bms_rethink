import { showError } from '../../../pages/bidding-reg-form/actions';

const BiddingServ = import('../../../services/bidding-proposal-service')

export default class {
  constructor(opt) {
    this.opt = opt
    this.bind()
  }

  success() {	
    // close popup
    document.getElementById('general-modal').close()
    window.location.reload()
  }

  error (err = '') {
    alert('Unable to remove this bidding request! Please try again later')
    // close popup
    document.getElementById('general-modal').close()
    console.log(err)
  }

  async send () {
    const serve =  (await BiddingServ).default
    const reason = document.querySelector('textarea#reason').value
    const __payload  = {
      id: this.opt.id,
      action: 'change',
      reason,
      token : window.localStorage.getItem('token'),
    }

    if(reason.length < 3) return

    // remove from DB
    return new serve().remove(__payload).then(res => { console.log(res)
      return res == 1 ?  this.success() : this.error()
    }).catch(err => this.error(err))
  }

  

  loadSend (e) {
    import('../../request-new-quotation-modal').then(res => {

      const __proto = Object.assign({ __proto__: this.__proto__ }, this)
      // DOM
      const __target = document.querySelector('#general-modal  > .content > .body')

      __target.innerHTML = res.template
      // close button
      __target.querySelector('#modal-dialog-close-button').addEventListener('click', document.querySelector('#general-modal').close)

      // remove button
      document.getElementById('modal-dialog-send-button').addEventListener('click', this.send.bind(__proto))
    })
  }

  bind () {
    const proto = Object.assign({ __proto__: this.__proto__ }, this)
    const root = this.opt.root || document
    root.querySelector(this.opt.selector).addEventListener('click',this.loadSend.bind(proto))
  }
  
}