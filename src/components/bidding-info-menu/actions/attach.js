import { showError } from '../../../pages/bidding-reg-form/actions';

const BiddingServ = import('../../../services/bidding-list-service')

export default class {
  constructor(opt){
    this.opt = opt
    return this.bindAttach()
  }

  hideSpinner () {
    const targ = document.querySelector('#bids-info-container > .spinner')
    if (targ) targ.hide()
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


  loadDialogPane () {
    // spinner
		import('../../../components/app-spinner').then(loader => {
			return new loader.default().show({target: '#bids-info-container'}).then(t => t.template.show())
    })
    
    return import('../../attachments-dialog').then(loader => {
      return new loader.default({
        target: 'body',
        id: this.opt.id
      })
    }).then(() => {
      this.hideSpinner()
    })
    
  }

  /**
   *Bind 
   *
   */
  bindAttach () {
		const proto = Object.assign({ __proto__: this.__proto__ }, this)
		const el = document.querySelectorAll(this.opt.selector)
		el.forEach((els, index) => {
			els.addEventListener('click',this.loadDialogPane.bind(proto))
		})
	}


}