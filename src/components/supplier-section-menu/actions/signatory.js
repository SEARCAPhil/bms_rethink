import { showError } from '../../../pages/bidding-reg-form/actions';

const BiddingServ = import('../../../services/bidding-list-service')

export default class {
  constructor(opt){
    this.opt = opt
    return this.bindChangeSignatories()
  }

  success() {	
    const __target = document.querySelector('#general-modal  > .content > .body')
    __target.innerHTML = `
      <section class="col-12 mt-5 text-center">
        <h3 class="text-success">Successfully Changed!</h3>
        <p class="text-muted">
          <small>You can now print this request. This will close automatically <mark>after 5 seconds.</mark></small>
        </p>
      </section>
    `
    // close popup with delay
    setTimeout(() => {
      document.getElementById('general-modal').close()
    },5000)

  }

  error (err = '') {
    alert('Unable to process your request! Please try again later')
    // close popup
    document.getElementById('general-modal').close()
    console.log(err)
  }


  /**
   * Set signatory in bidding request
   */
  async set () {
    const serve =  (await BiddingServ).default
		// values
		const requested = document.querySelector('input#requested').value
		const requested_position = document.querySelector('input#requested_position').value
		const recommended = document.querySelector('input#recommending').value
		const recommended_position = document.querySelector('input#recommending_position').value
		const approved = document.querySelector('input#approved').value
    const approving_position = document.querySelector('input#approving_position').value
    
    // payload
		const __payload = {
			requested,
			requested_position,
			recommended,
			recommended_position,
			approved,
			approving_position,
			id: this.opt.id,
			token : window.localStorage.getItem('token'),
    }

    // update data
    return new serve().signatories(__payload).then(json => {
      const res = JSON.parse(json)
      return res ? this.success() : this.error()
    }).catch(err => this.error(err))

  }
  
  /**
   *Fetch signatory form
   *
   */
  loadSetSignatories () {
    import('../../sign-conf-modal').then(res => {

      const __proto = Object.assign({ __proto__: this.__proto__ }, this)
      // DOM
      const __target = document.querySelector('#general-modal  > .content > .body')

      __target.innerHTML = res.template
      // close button
      __target.querySelector('#modal-dialog-close-button').addEventListener('click', document.querySelector('#general-modal').close)

      // remove button
      document.getElementById('modal-dialog-send-button').addEventListener('click', this.set.bind(__proto))
    })
  }

  /**
   *Bind 
   *
   */
  bindChangeSignatories () {
		const proto = Object.assign({ __proto__: this.__proto__ }, this)
		const el = document.querySelectorAll(this.opt.selector)
		el.forEach((els, index) => {
			els.addEventListener('click',this.loadSetSignatories.bind(proto))
		})
	}


}