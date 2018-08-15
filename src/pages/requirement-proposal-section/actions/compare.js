import ApiConfig from '../../../config/api'

export default class {
  constructor(opt){
    this.opt = opt
    this.opt.token = window.localStorage.getItem('token')
    this.sendingList = []
    this.__apiConfig = ApiConfig
    return this.__bind()
  }

  compare () {
    // compare
    let compareBtn = document.querySelector('#compare-btn:not(.event-binded)')

    if (compareBtn) {
      compareBtn.classList.add('event-binded')
      compareBtn.addEventListener('click' , () => {
        // get all selected checkbox
        let ids = []
        const isSignatoriesIncluded = document.querySelector('#compare-sign-checkbox').checked ? '&signatories=true' : ''
        document.querySelectorAll(`.compare-checkbox-list:checked`).forEach((el, index) => {
          const atr = el.getAttribute('data-resources')
          if (!ids[atr]) ids.push(atr)
        })
        window.open(`${this.__apiConfig.url}/bidding/reports/proposal_comparison.php?id=${this.opt.id}&token=6170b5207b92e5a7445ee3f7de7247c4c1f1b8ef&prop=${ids.join(',')}${isSignatoriesIncluded}`)
      })
    }
  }


  load (e) {
    document.querySelectorAll('.compare-checkbox-list').forEach((el, index) => {
      // exclude proposals that need changes
      if (!el.classList.contains('2')) {	
        e.target.checked ? el.checked = true : el.checked = false
      }
    }) 
  }


  /**
   *Bind 
   *
   */
  __bind () {
		const proto = Object.assign({ __proto__: this.__proto__ }, this)
		const el = document.querySelectorAll(this.opt.selector)
		el.forEach((els, index) => {
			els.addEventListener('click',this.load.bind(proto))
    })
    this.compare()
	}

}