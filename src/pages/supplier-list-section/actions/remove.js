
const BiddingServ = import('../../../services/supplier-service')

export default class {
  constructor(opt) {
    this.opt = opt
    this.bindRemoveBidding()
  }

  success(id) {	
    // close popup
    document.getElementById('general-modal').close()
    document.querySelector(`#suppliers-list-${id}`).remove()
  }

  error (err = '') {
    alert('Unable to remove this item! Please try again later')
    // close popup
    document.getElementById('general-modal').close()
    console.log(err)
  }

  __showRemoving (target) {
    target.innerHTML = '<p>Removing content . . . Please wait</p>'
  }

  async removeBidding (e) { 
    const serve =  (await BiddingServ).default
    const __payload  = {
      id: e.target.id,
      action: 'remove',
      token : window.localStorage.getItem('token'),
    }

    this.__showRemoving (e.target.parentNode)
    // remove from DB
    return new serve().remove(__payload).then(res => { console.log(res)
      return res == 1 ?  this.success(e.target.id) : this.error()
    }).catch(err => this.error(err))
  }

  loadRemoveBidding (e) {
    const __id = e.target.getAttribute('data-resource')
    if (!__id) return

    import('../../../components/remove-conf-modal').then(res => {

      const __proto = Object.assign({ __proto__: this.__proto__ }, this)
      // DOM
      const __target = document.querySelector('#general-modal  > .content > .body')

      __target.innerHTML = res.template
      // close button
      __target.querySelector('#modal-dialog-close-button').addEventListener('click', document.querySelector('#general-modal').close)

      // remove button
      const __btn = document.getElementById('modal-dialog-remove-button')
      __btn.id = __id
      __btn.addEventListener('click', this.removeBidding.bind(__proto))
    })
  }

  bindRemoveBidding () {
    const proto = Object.assign({ __proto__: this.__proto__ }, this)
    const root = this.opt.root || document
    root.querySelectorAll(this.opt.selector).forEach((el, index) => {
      el.addEventListener('click',this.loadRemoveBidding.bind(proto))
    })
  }
  
}