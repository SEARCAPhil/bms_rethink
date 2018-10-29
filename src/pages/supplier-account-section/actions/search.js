
const suppServ = import('../../../services/supplier-account-service')

export default class {
  constructor(opt) {
    this.opt = opt
    this.__timeout = {}
    this.bindSearch()
  }

  __searchSuccess (json) {
    let __searchSec= this.opt.root.querySelector('#account-search-section')
    __searchSec.innerHTML = this.opt.singleton.__generateTableHeader()
    // append to DOM
    this.opt.singleton.__generateTableListData( json, '#account-search-section > .accounts-table > tbody')
  }

  __searchEmpty (param) {
    this.opt.root.querySelector('#account-search-section').innerHTML = `<small class="text-muted col-12 text-center mb-5 mt-3">The word you are trying to search "${param}" doesn't match any result. <br/>Please try again using another keyword</small>`
  }

  __search (page, param) {
    suppServ.then(res => {
      const __payload = {
        param,
        page: page || 1,
        id: this.opt.id,
        token: window.localStorage.getItem('token'),
      }
      new res.default().search(__payload).then(res => {
        if(!res.data.length) return this.__searchEmpty(param)
        return this.__searchSuccess (res.data)
      })
    })
  }


  __searchCallPre () {
    let __searchField = this.opt.root.querySelector('#account-search-section')
    this.opt.root.querySelector('#list-account-of-stats-section').classList.remove('hide')
    this.opt.root.querySelector('#list-account-table-container').classList.remove('hide')
    __searchField.classList.add('hide')
  }

  __searchCallBack(param) {
    let __searchField = this.opt.root.querySelector('#account-search-section')
    this.opt.root.querySelector('#list-account-of-stats-section').classList.add('hide')
    this.opt.root.querySelector('#list-account-table-container').classList.add('hide')
    __searchField.classList.remove('hide')
    // search
    this.__search (1, param)
  }

  load (e) {

      clearTimeout(this.__timeout)
      this.__timeout = setTimeout(() => {
        if(e.target.value.length < 1) return this.__searchCallPre () 
        // search
        return this.__searchCallBack (e.target.value) 
      }, 600)
  }

  bindSearch () {
    const proto = Object.assign({ __proto__: this.__proto__ }, this)
    const root = this.opt.root || document
    root.querySelectorAll(this.opt.selector).forEach((el, index) => {
      el.addEventListener('keyup',this.load.bind(proto))
    })
  }
  
}