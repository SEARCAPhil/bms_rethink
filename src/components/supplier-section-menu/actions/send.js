import { showError } from '../../../pages/bidding-reg-form/actions';

const BiddingServ = import('../../../services/bidding-list-service')
const AccServ = import('../../../services/accounts')

export default class {
  constructor(opt){
    this.opt = opt
    this.opt.token = window.localStorage.getItem('token')
    this.sendingList = []
    return this.__bindSend()
  }

  hideSpinner () {
    const targ = document.querySelector('#general-modal > .spinner')
    if (targ) targ.hide()
  }

  async send (e) {
    e.target.disabled = 'disabled'
    e.preventDefault()
    const __serv = (await BiddingServ).default
    const __cont = Object.keys(this.sendingList)

    let __emails = []

    // removed unwanted spaces
    __cont.forEach((val, index) => {
      if(val.trim().length > 0) __emails.push(val)
    })

    // must contain atleast 1 email
    if(__emails.length < 1) {
      alert('Unable to send this request. Please try again later')
      return document.getElementById('general-modal').close()
    } 

    const __payload = {
      id: this.opt.id,
      emails: __emails,
      action: 'create',
      token : this.opt.token,
    }

   // spinner
		import('../../app-spinner').then(loader => {
			return new loader.default().show({target: '#general-modal'}).then(t => t.template.show())
    })
    

    return new __serv().send(__payload).then(res => {
      // reload on success
      return (res.data.length === __emails.length) ? window.location.reload() : (alert('Notice : Not all collaborators specified did not received this request.') | this.hideSpinner() | (e.target.disabled = false))
    })
     
  }

	loadSend (e) {
    const __proto = Object.assign({ __proto__: this.__proto__ }, this)
    return import('../../send-to-cba-modal').then(loader => { 
      const __target = document.querySelector('#general-modal > .content > .body')
      __target.innerHTML = loader.template
      __target.querySelector('#modal-dialog-close-button').addEventListener('click', () => document.querySelector('#general-modal').close())
      this.getCBA()
      setTimeout(() => {
        document.getElementById('modal-dialog-send-button').addEventListener('click', this.send.bind(__proto))
      }, 1000)
    })
  }
  
  __removeFromSendingList (e) {
    const resources = e.target.getAttribute('data-resources')
    e.target.parentNode.parentNode.remove()
  
    // unchecked item
    document.querySelector(`.cba-send-check-list-${resources}`).checked = false
    delete this.sendingList[resources]
  }

  __toggleBtn () {
    setTimeout(() => {
      // enable send button
      const targetBtn = document.getElementById('modal-dialog-send-button')
      return (Object.keys(this.sendingList).length > 0) ? targetBtn.removeAttribute('disabled') : targetBtn.setAttribute('disabled', 'disabled')
    }, 10)
  }

  __checkCBA (e) {
    const targ = document.querySelector('.cba-invitation-sending-list-section')
    const name = e.target.cbaName
    const __proto = Object.assign({ __proto__: this.__proto__ }, this)
  
    // add
    if (e.target.checked) {
      const html = document.createElement('div')
      html.classList.add('col-12', 'col-md-12', `list-${e.target.value}`)
      html.style.fontSize = '12px'
      html.style.marginTop = '3px'
      html.innerHTML = `
          <div class="col alert alert-dark row cbaName" style="position:relative;overflow:hidden;text-overflow:ellipsis;">
            ${name}
          </div>
      `
      // remove button
      const removeBtn = document.createElement('span')
      removeBtn.setAttribute('style', 'position:absolute;right:10px;top:0px;color:rgb(90,90,90);cursor:pointer;')
      removeBtn.setAttribute('data-resources', e.target.value)
      removeBtn.textContent = 'X'
      removeBtn.addEventListener('click', this.__removeFromSendingList.bind(__proto))
  
      html.querySelector('.cbaName').append(removeBtn)
      targ.append(html)
      // add to virtual list
      this.sendingList[e.target.value] = name
    } else {
      // remove
      delete this.sendingList[e.target.value]
      document.querySelector(`.list-${e.target.value}`).remove()
    }
  
    this.__toggleBtn()
  }

  __showCBA (data, target) {
    const targ = document.querySelector(target)
    const __proto = Object.assign({ __proto__: this.__proto__ }, this)

    data.forEach((val, index) => {
      // parent element
      const html = document.createElement('div')
      html.classList.add('row')
      html.innerHTML =  `
        <div class="col-1 checkBtn-section"></div>
        <div class="col-11 text-muted">
          <div class="text-center" style="float: left;width: 35px;height: 35px;border-radius: 50%;margin-right: 10px;overflow: hidden;background: #ffb80c;color:#fff;padding-top: 5px;" id="image-header-section">${val.profile_name.substr(0,2).toUpperCase()}</div>
          <div class="text-center float-left p-1">${val.profile_name}</div>
        </div>
      `
      // checkbutton
      const checkBtn = document.createElement('input')
      checkBtn.classList.add(`cba-send-check-list-${val.id}`)
      checkBtn.type = 'checkbox'
      checkBtn.value = val.id
      checkBtn.name = 'cba-send-check-list'
      checkBtn.addEventListener('change', this.__checkCBA.bind(__proto))
      checkBtn.cbaName = val.profile_name

      html.querySelector('.checkBtn-section').append(checkBtn)
      targ.append(html)
    })
  
  }

  async getCBA () {
    const __serv = (await AccServ).default
    const __cba = new __serv().cbaList({page: 1, token: window.localStorage.getItem('token'), id: this.opt.id})
    __cba.then(json => {
      this.__showCBA(json, '.cba-invitation-check-list-section') 
    })
  }

  __bindSend () {
    const __proto = Object.assign({ __proto__: this.__proto__ }, this)
		const el = document.querySelectorAll(this.opt.selector)
		el.forEach((els, index) => {
			els.addEventListener('click',this.loadSend.bind(__proto))
		})
	}


}