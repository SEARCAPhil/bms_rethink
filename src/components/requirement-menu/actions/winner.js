const BiddingReqServ = import('../../../services/bidding-req-service')
const SupplierServ = import('../../../services/supplier-service')
const statusMessage = import('../../requirement-status')
const infoStatus = import('../../bidding-status')

let globalSuppliers = {}
export default class {
  constructor(opt){
    this.opt = opt
    this.opt.token = window.localStorage.getItem('token')
    this.sendingList = {}
    this.sendingItems = {}
    this.suppliers = {}
    this.__timeout = {}
    
    return this.__bind()
  }

  __showError () {
    alert('Oops! Unable to resend this request. Please try again later.')
  }

  __removeFromSendingList (e) {
    const resources = e.target.getAttribute('data-resources')
    e.target.parentNode.parentNode.remove()
    // unchecked item
    document.querySelector(`.suppliers-send-check-list-${resources}`).checked = false
    delete this.sendingList[resources]

    this.__toggleButton()
  }

  __toggleButton () {
    setTimeout(() => {
      // enable send button
      const __btn = document.getElementById('modal-dialog-send-button')
      if ((Object.keys(this.sendingList).length) > 0) return __btn.removeAttribute('disabled') 
      __btn.setAttribute('disabled', 'disabled') 
  
    }, 10)
  }

  __checkSupplier (e) {
    const __targ = document.querySelector('.suppliers-invitation-sending-list-section')
    const __name = e.target.getAttribute('data-suppliers-name')
    const __proto = Object.assign({ __proto__: this.__proto__ }, this)

    // add
    if (e.target.checked) {
      const html = document.createElement('div')
      html.classList.add('col-12', 'col-md-12', `list-${e.target.value}`)
      html.style.fontSize = '12px'
      html.style.marginTop = '3px'
      html.innerHTML = `
          <div class="col alert alert-dark row suppliersName" style="position:relative;overflow:hidden;text-overflow:ellipsis;">
            ${__name}
          </div>
      `
  
      const removeBtn = document.createElement('span')
      removeBtn.setAttribute('style', 'position:absolute;right:10px;top:0px;color:rgb(90,90,90);cursor:pointer;')
      removeBtn.setAttribute('data-resources', e.target.value)
      removeBtn.textContent = 'X'
      removeBtn.addEventListener('click', this.__removeFromSendingList.bind(__proto))
  
      html.querySelector('.suppliersName').append(removeBtn)
      
      __targ.innerHTML = ''
      __targ.append(html)
      // add to virtual list
      this.sendingList = {}
      this.sendingList[e.target.value] = __name
      globalSuppliers = this.sendingList
      

    } else {
      // remove
     // delete this.sendingList[e.target.value]
      //document.querySelector(`.list-${e.target.value}`).remove()
      
    }
    
    this.__toggleButton()
  
  }
  
  __appendSuppliersList (target, data, isEmpty = false) {
    const __target = document.querySelector(target)
    const __proto = Object.assign({__proto__: this.__proto__ }, this)

    if(isEmpty) __target.innerHTML = ''
    
    data.forEach((val, index) => {
      const __el = document.createElement('section')
      __el.classList.add('row')
      __el.innerHTML = `<div class="col-1 checkBtn-section" name="${val.name}" data-resources="${val.id}" value="${val.id}">
            <input class="suppliers-send-check-list-${val.id} suppliers-send-check-list" type="radio" value="${val.id}" name="suppliers" data-suppliers-name="${val.name}">
          </div>
          <div class="col-11 text-muted">${val.name}</div>`
      __el.querySelector('input').addEventListener('change', this.__checkSupplier.bind(__proto))
      __target.append(__el)
      
    })
  }

  async __getSuppliersList (opt = {}) {
    const __serv = (await SupplierServ).default
  
    return new __serv().list({page: opt.page || 1, filter: 'all'}).then(res => {
      if(res.data) { 
        this.__appendSuppliersList('.suppliers-invitation-check-list-section', res.data)
      }
    }).catch(err => console.log(err))
  }

  async __searchSupplier (e) { 
    const __serv = (await SupplierServ).default
    clearTimeout(this.__timeout)

    this.__timeout = setTimeout(() => {
      if (!e.target.value.length) {
        this.__getSuppliersList()
      }

      return new __serv().search({ param: e.target.value }).then(res => {
        if(res.data) {
          this.__appendSuppliersList('.suppliers-invitation-check-list-section', res.data, true)
        }
      })
    }, 1000)
    
    
  }

  __bindSearchSupplier() { 
    // bind search
    const __proto = Object.assign({ __proto__: this.__proto__ }, this)
    document.getElementById('search-supplier').addEventListener('keyup', this.__searchSupplier.bind(__proto))
  }

  /**
	 * Display notification to attach bidding resolution after they awarded a supplier.
	 * @param {Object} e - MouseEvent
	 * @returns XMLHttpRequest
	 */
	loadAwardRequirementsAttachmentsNotice () {

		const __proto = Object.assign({ __proto__: this.__proto__ }, this)
    return import('../../award-attachments-notice-modal').then(loader => { 
      const __target = document.querySelector('#general-modal > .content > .body')
      __target.innerHTML = loader.template
      __target.querySelector('#modal-dialog-send-button').addEventListener('click', () => {
        document.getElementById('general-modal').close()
        // click attachment button
        document.querySelector('.file-attachment-requirement-dialog-btn').click()
      })

      statusMessage.then(loader => {
        const __targ = document.querySelector('#requirement-menu-status')
        __targ.innerHTML = ''
        infoStatus.then(stat => {
          return new stat.default(loader.showModifiedStatus()).then(html => __targ.append(html))
        })
        
      })
    })
	}



  async process(e) {
    const __serv = (await BiddingReqServ).default
    const __payload = {
      id: this.opt.id,
			suppliers: globalSuppliers,
			remarks: document.getElementById('remarks').value,
			action: 'winner',
			token: window.localStorage.getItem('token')
    }
   
    const br = Object.values(globalSuppliers)
    let x = 0;

    e.target.disabled = 'disabled'
    return new __serv().winner(__payload).then(res => {
      if(!res) return this.__showError ()
      if(parseInt(res) > 0) { 
        return  this.loadAwardRequirementsAttachmentsNotice()
      }
    }).catch(err => console.log(err))

  }


	load (e) { 
    const __proto = Object.assign({ __proto__: this.__proto__ }, this)
    return import('../../winner-modal').then(loader => { 
      const __target = document.querySelector('#general-modal > .content > .body')
      __target.innerHTML = loader.template
      this.__getSuppliersList()
      this.__bindSearchSupplier()
      __target.querySelector('#modal-dialog-send-button').addEventListener('click', this.process.bind(__proto))
    })
  }


  __bind () {
    const __proto = Object.assign({ __proto__: this.__proto__ }, this)
		const el = document.querySelectorAll(this.opt.selector)
		el.forEach((els, index) => {
			els.addEventListener('click',this.load.bind(__proto))
		})
	}


}