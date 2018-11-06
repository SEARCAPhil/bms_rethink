import { showError } from '../../../pages/bidding-reg-form/actions';

const BiddingServ = import('../../../services/supplier-account-service')

export default class {
  constructor(opt) {
    this.opt = opt
    this.bindRemoveBidding()
  }
  __emptyInfo () {
    return  `<section class="col-10 offset-1">
                <center>
                  <h3>This account has been removed.</h3>
                  <span class="text-muted">Please go back to the suppliers list and select account <a href="#/suppliers/all"><i class="material-icons">keyboard_return</i></a></span>
                </center>
              </section>`
  }
  success() {	
    // close popup
    document.getElementById('general-modal').close()
    document.querySelector('#supplier-info-menu').remove()
    document.querySelector('suppliers-section-container').innerHTML = this.__emptyInfo()
  }

  error (err = '') {
    alert('Unable to remove this account! Please try again later')
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
    return new serve().remove(__payload).then(res => { 
      return res.data == 1 ?  this.success() : this.error()
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