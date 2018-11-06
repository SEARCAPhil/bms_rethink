const BiddingServ = import('../../../services/supplier-account-service')

export default class {
  constructor(opt) {
    this.opt = opt
    this.bind()
  }

  success() {	
    const __targ = document.querySelector('#general-modal  > .content > .body')
    __targ.innerHTML =  `<div class="col-12 mt-3 p-3"><h3 class="text-success">Password Changed Successfully <i class="material-icons md-32 text-success">check_circle</i></h3>
    <small>Changes applies only for on-premise authentication. Original Office365 password would not be affected.  </small></div>
      `
    
  }

  error (err = '') {
    alert('Unable to change password! Make sure that your password is correct.')
    // close popup
    document.getElementById('general-modal').close()
    console.log(err)
  }

  async change () {
    const serve =  (await BiddingServ).default
    const pass = document.querySelector('.password')
    const pass2 = document.querySelector('.password2')
    const __payload  = {
      id: this.opt.id,
      action: 'password',
      pass: pass.value,
      pass2: pass2.value,
      status: this.opt.status,
      token : window.localStorage.getItem('token'),
    }

    if(pass.length < 3 || pass2.value !== pass.value) {
      return this.error()
    } else {
      // change pass
      return new serve().changePassword(__payload).then(res => { 
        return res.data == 1 ?  this.success() : this.error()
      }).catch(err => this.error(err))
    }
    
  }

  load(e) {
    import('../../change-pass-conf-modal').then(res => {

      const __proto = Object.assign({ __proto__: this.__proto__ }, this)
      // DOM
      const __target = document.querySelector('#general-modal  > .content > .body')

      __target.innerHTML = res.template
      // close button
      __target.querySelector('#modal-dialog-close-button').addEventListener('click', document.querySelector('#general-modal').close)

      // remove button
      document.getElementById('modal-dialog-remove-button').addEventListener('click', this.change.bind(__proto))
    })
  }

  bind () {
    const proto = Object.assign({ __proto__: this.__proto__ }, this)
    const root = this.opt.root || document
    root.querySelector(this.opt.selector).addEventListener('click',this.load.bind(proto))
  }
  
}