const BiddingServ = import('../../../services/supplier-account-service')

export default class {
  constructor(opt) {
    this.opt = opt
    this.bind()
  }

  success() {	
    // reload browser
    document.querySelector('.remove-modal-section > center').innerHTML = `<h3 class="text-success">Email Sent!</h3> 
    Password reset confirmation email was sent to the user<br/>
    <i class ="material-icons md-48 text-success">check_circle</i>`
  }

  error (err = '') {
    alert('Unable to send email to this account! Please try again later')
    // close popup
    document.getElementById('general-modal').close()
    console.log(err)
  }

  async link (e) {
    const serve =  (await BiddingServ).default
    const __payload  = {
      id: this.opt.id,
      action: 'password_link',
      token : window.localStorage.getItem('token'),
    }

    e.target.setAttribute('disabled', 'disabled')
    document.querySelector('.remove-modal-section > center').innerHTML = '<h3>Sending . . .</h3> Please wait . . .'
  
    // remove from DB
    return new serve().changePassword(__payload).then(res => { 
      return res.data == 1 ?  (this.success() | e.target.setAttribute('disabled', '')) : this.error()
    }).catch(err => this.error(err))
  }

  load(e) {
    import('../../change-pass-link-conf-modal').then(res => {

      const __proto = Object.assign({ __proto__: this.__proto__ }, this)
      // DOM
      const __target = document.querySelector('#general-modal  > .content > .body')

      __target.innerHTML = res.template
      // close button
      __target.querySelector('#modal-dialog-close-button').addEventListener('click', document.querySelector('#general-modal').close)

      // remove button
      document.getElementById('modal-dialog-remove-button').addEventListener('click', this.link.bind(__proto))
    })
  }

  bind () {
    const proto = Object.assign({ __proto__: this.__proto__ }, this)
    const root = this.opt.root || document
    root.querySelector(this.opt.selector).addEventListener('click',this.load.bind(proto))
  }
  
}