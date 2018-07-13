import { showError } from '../../../pages/bidding-reg-form/actions';

const BiddingServ = import('../../../services/bidding-list-service')

export default class {
  constructor(opt) {
    this.opt = opt
    this.bindRemoveBidding()
  }

  success() {	
    // close popup
      document.getElementById('general-modal').close()

    // clear fields
    return document.querySelector('#bids-info-container').innerHTML = `
      <center style="margin-top:70px;" class="col-lg-8 offset-lg-2 col-12">
        <p class="text-success">Deleted successfully! <i class="material-icons">check</i></p>
        <small><p>You will not be able to see this item on the system any longer.<br/> Please refresh your browser or select new bidding request</p></small>
      </center>
    `
  }

  error (err = '') {
    alert('Unable to remove this bidding request! Please try again later')
    // close popup
    document.getElementById('general-modal').close()
    console.log(err)
  }

  async removeBidding () {
    const serve =  (await BiddingServ).default
    const __payload  = {
      id: this.opt.id,
      action: 'remove',
      token : window.localStorage.getItem('token'),
    }

    // remove from DB
    return new serve().remove(__payload).then(json => {
      return json.data == 1 ?  this.success() : this.error()
    }).catch(err => this.error(err))
  }

  loadRemoveBidding (e) {
    import('../../remove-conf-modal').then(res => {

      const __proto = Object.assign({ __proto__: this.__proto__ }, this)
      // DOM
      const __target = document.querySelector('#general-modal  > .content > .body')

      __target.innerHTML = res.template
      // close button
      __target.querySelector('#modal-dialog-close-button').addEventListener('click', document.querySelector('#general-modal').close)

      // remove button
      document.getElementById('modal-dialog-remove-button').addEventListener('click', this.removeBidding.bind(__proto))
    })
  }

  bindRemoveBidding () {
    const proto = Object.assign({ __proto__: this.__proto__ }, this)
    const root = this.opt.root || document
    root.querySelector(this.opt.selector).addEventListener('click',this.loadRemoveBidding.bind(proto))
  }
  
}