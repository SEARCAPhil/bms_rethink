const BiddingReqServ = import('../../../services/bidding-req-service')
const SupplierServ = import('../../../services/supplier-service')

export default class {
  constructor(opt){
    this.opt = opt
    this.opt.token = window.localStorage.getItem('token')
    this.sendingList = {}
    this.sendingItems = {}
    this.__timeout = {}
    return this.__bind()
  }

  __showError () {
    alert('Oops! Unable to resend this request. Please try again later. Make sure you have set the deadline before inviting a supplier')
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
    const __name = e.target.name
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
  
      __targ.append(html)
      // add to virtual list
      this.sendingList[e.target.value] = __name

    } else {
      // remove
      delete this.sendingList[e.target.value]
      document.querySelector(`.list-${e.target.value}`).remove()
      
    }
    
    this.__toggleButton()
  
  }
  
  __appendSuppliersList (target, data, isEmpty = false) {
    const __target = document.querySelector(target)
    const __proto = Object.assign({ __proto__: this.__proto__ }, this)

    if(isEmpty) __target.innerHTML = ''

    data.forEach((val, index) => {
      const __el = document.createElement('section')
      __el.classList.add('row')
      __el.innerHTML = `<div class="col-1 checkBtn-section" name="${val.name}" data-resources="${val.id}" value="${val.id}">
            <input class="suppliers-send-check-list-${val.id} suppliers-send-check-list" type="checkbox" value="${val.id}" name="${val.name}">
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

  __checkItem (e) {
    const name = e.target.itemName
    // add
    if (e.target.checked) {
      // ad dto virtual list
      this.sendingItems[e.target.value] = name
    } else {
      // remove
      delete this.sendingItems[e.target.value]
    }
  }

  __appendItems (target, data, isEmpty = false) {
    const __targ = document.querySelector(target)
    const __proto = Object.assign({ __proto__: this.__proto__ }, this)
    
    data.forEach((val, index) => {
      let html = document.createElement('details')
      html.classList.add('col-12','row')
      html.innerHTML = `<summary>${val.name}</summary>`

      val.requirements.forEach((req, index) => {	
        let htmls = document.createElement('div')
        htmls.classList.add('row')

        // checkbutton
        const checkBtn = document.createElement('input')
        checkBtn.classList.add(`items-send-check-list-${req.id}`)
        checkBtn.type = 'checkbox'
        checkBtn.value = req.id
        checkBtn.name = 'items-send-check-list'
        checkBtn.addEventListener('click', this.__checkItem.bind(__proto))
        checkBtn.itemName = req.id

        htmls.innerHTML = `	
          <div class="col-1 checkBtn-section"></div>
          <div class="col-11 text-muted">
            ${req.name}
          </div>`
        htmls.querySelector('.checkBtn-section').append(checkBtn)
        html.append(htmls)
      })
      __targ.append(html)
    })
  }

  async __getItems () {
    const __serv = (await import('../../../services/bidding-list-service')).default
    return new __serv().view({id: this.opt.bidding_id, token: this.opt.token}).then(res => { console.log(res)
      if(!res.data) return
      if(!res.data[0]) return
      this.__appendItems('.item-sending-list-section', res.data[0].particulars, true)
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


  async process(e) {
    const __serv = (await BiddingReqServ).default
    const __payload = {
      id: this.opt.id,
      suppliers: this.sendingList,
      items: this.sendingItems,
      action: Object.keys(this.sendingItems).length > 0 ? 'send_items' : 'send',
      token: window.localStorage.getItem('token'),
    }
    const br = Object.values(this.sendingList)
    let x = 0;

    e.target.disabled = 'disabled'
    return new __serv().invite(__payload).then(res => {
      if(res.data) { 
        for(let val in res.data) {
          return window.location.reload()
        }
      }
      return this.__showError ()
    }).catch(err => console.log(err) | this.__showError ())

  }


	load (e) {
    const __proto = Object.assign({ __proto__: this.__proto__ }, this)
    return import('../../requirement-invitation-advanced-modal').then(loader => { 
      const __target = document.querySelector('#general-modal > .content > .body')
      __target.innerHTML = loader.template
      __target.querySelector('#modal-dialog-send-button').addEventListener('click', this.process.bind(__proto))
      this.__getSuppliersList()
      this.__bindSearchSupplier()
      this.__getItems()
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