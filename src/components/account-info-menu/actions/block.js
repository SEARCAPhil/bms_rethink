const BiddingServ = import('../../../services/supplier-account-service')

export default class {
  constructor(opt) {
    this.opt = opt
    this.bind()
  }

  success() {	
    // reload browser
    window.location.reload()
  }

  error (err = '') {
    alert('Unable to remove this account! Please try again later')
    // close popup
    document.getElementById('general-modal').close()
    console.log(err)
  }

  async block () {
    const serve =  (await BiddingServ).default
    const __payload  = {
      id: this.opt.id,
      action: 'block',
      status: this.opt.status,
      token : window.localStorage.getItem('token'),
    }

    // remove from DB
    return new serve().remove(__payload).then(res => { 
      return res.data == 1 ?  this.success() : this.error()
    }).catch(err => this.error(err))
  }

  load(e) {
    import('../../block-conf-modal').then(res => {

      const __proto = Object.assign({ __proto__: this.__proto__ }, this)
      // DOM
      const __target = document.querySelector('#general-modal  > .content > .body')

      __target.innerHTML = res.template
      // close button
      __target.querySelector('#modal-dialog-close-button').addEventListener('click', document.querySelector('#general-modal').close)

      // remove button
      document.getElementById('modal-dialog-remove-button').addEventListener('click', this.block.bind(__proto))
    })
  }

  bind () {
    const proto = Object.assign({ __proto__: this.__proto__ }, this)
    const root = this.opt.root || document
    root.querySelector(this.opt.selector).addEventListener('click',this.load.bind(proto))
  }
  
}