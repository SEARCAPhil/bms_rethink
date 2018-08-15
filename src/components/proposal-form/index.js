
export default class {
  constructor(opt = {}) {
    this.__info = {}
    this.opt = opt
    return this.loadDialog()
  
  }

  __bindListeners () {
    this.template.querySelector(`#file-attachment-main-dialog-cancel-btn-${this.opt.id}`).addEventListener('click', () => {
      document.querySelector(`#file-attachment-main-dialog-${this.opt.id}`).close()
    })
  }


  async loadDialog () { 
    const __proto = Object.assign({__proto__: this.__proto__}, this)
    const dialog = (await import('../dialog-pane')).default

    return new dialog(this.opt).then(res => {
      // open dialog pane
      res.open()
      this.render()

      // attach to DOM
      const sec = document.querySelector(`#file-attachment-main-dialog-${this.opt.id} > .body`)
      if(!sec) return
      sec.parentNode.style.zIndex = 5
      sec.innerHTML = ''
      sec.append(this.template)
      console.log(sec)
    })
  }

  
  __autoComputeTotalAmount (quantity) {
    const targ = document.querySelector('#proposal-form-amount-per-item:not(.event-binded)')
    const totalTarg = document.querySelector('#proposal-form-amount')
  
    if (targ) {
      targ.classList.add('event-binded')
      targ.addEventListener('keyup', () => {
        const total = (targ.value*quantity)
        totalTarg.value = total
      })
    } 
  }

  __cancelSpecsInput  (e)  {
    const __proto = Object.assign({__proto__: this.__proto__}, this)
    const val = e.target.value
    const id = e.target.id
  
    let targ = document.getElementById(`orig-req-val-${id}`)
    targ.innerHTML = val
  
    // change link
    let btn = document.createElement('a')
    btn.href = '#'
    btn.setAttribute('onclick', 'event.preventDefault()')
    btn.setAttribute('data-resources', id)
    btn.setAttribute('data-resources-val', val)
    btn.textContent = 'change'
    btn.addEventListener('click', this.__changeEventSpecsInput.bind(__proto))
  
    e.target.replaceWith(btn)
  }
  
  __changeEventSpecsInput (e) {
    const __proto = Object.assign({__proto__: this.__proto__}, this)
    const id = e.target.getAttribute('data-resources')
    const origValue = e.target.getAttribute('data-resources-val')
    const origEl = e.target
    let targ = document.getElementById(`orig-req-val-${id}`)
    targ.innerHTML = `<input type="text" style="width:250px;" placeholder="${origValue}" class="specs-input-section-value" data-resources="${id}"/>`
  
    let link = document.createElement('a')
    link.href = '#'
    link.setAttribute('onclick','event.preventDefault();')
    link.textContent = 'cancel'
    link.id = id
    link.value = origValue
    link.setAttribute('data-resources', id)
    link.setAttribute('data-resources-val', origValue)
    link.addEventListener('click', this.__cancelSpecsInput.bind(__proto))
    
    e.target.replaceWith(link)
  }

  __addOtherSpecsField () {
    let targ = document.getElementById('specs-other-section')
  
    let sec = document.createElement('section')
  
    sec.innerHTML = `
      <span class="row specs-input-section specs-input-section-others " style="margin-top: 15px;">
         <div class="col-lg-4 col-md-4">
            <input type="text" class="other-req-name-fields specs-input-section-name form-control" placeholder="name"/>
          </div>
          <div class="col-lg-8 col-md-8">
            <input type="text" class="other-req-value-fields specs-input-section-value form-control" placeholder="value"/>
            <small class="orig-req-menu">
              <a href="#" onclick="event.preventDefault();this.parentNode.parentNode.parentNode.remove()">remove</a>
            </small>
          </div>
  
      </span>
    `
    targ.append(sec)
  }

  __loadAdditionalSettings() {
    const __proto = Object.assign({__proto__: this.__proto__}, this)
  // attach to DOM
    setTimeout(() => {
      const section = document.querySelector('.specs-section-proposal')
      const sectionOthers = document.querySelector('#specs-other-section')
      this.__autoComputeTotalAmount(this.opt.info.quantity)

      // original specs
      this.opt.info.orig_specs.forEach((val, index) => {
        let html = document.createElement('span')
        html.classList.add('row', 'specs-input-section', 'specs-input-section-orig')
        html.setAttribute('data-resources', this.opt.info.id)
        html.setAttribute('style', 'margin-top: 15px;')
        html.innerHTML = `
            <div class="col-lg-3 col-md-3" id="orig-req-name-${val.id}" class="orig-req-name">
              <b>${val.name}</b>
            </div>
            <div class="col-lg-9 col-md-9">
              <span id="orig-req-val-${val.id}" class="orig-req-val" data-resources-val="${val.value}">${val.value}</span>
              <small class="orig-req-menu"></small>
            </div>

        `

        // change link
        let btn = document.createElement('a')
        btn.href = '#'
        btn.setAttribute('onclick', 'event.preventDefault()')
        btn.setAttribute('data-resources', val.id)
        btn.setAttribute('data-resources-val', val.value)
        btn.textContent = 'change'
        btn.addEventListener('click', this.__changeEventSpecsInput.bind(__proto))

        html.querySelector('.orig-req-menu').append(btn)
        section.append(html)
      })

      // other specs
      // specs
      this.opt.info.other_specs.forEach((val, index) => {
        let html = document.createElement('span')
        html.classList.add('row', 'specs-input-section', 'specs-input-section-others')
        html.setAttribute('data-resources', this.opt.info.id)
        html.setAttribute('style', 'margin-top: 15px;')
        html.innerHTML = `
            <div class="col-lg-4 col-md-4">
                <input type="text" class="other-req-name-fields specs-input-section-name form-control" placeholder="name" value="${val.name}"/>
              </div>
              <div class="col-lg-8 col-md-8">
                <input type="text" class="other-req-value-fields specs-input-section-value form-control" placeholder="value" value="${val.value}" data-resources="${val.id}"/>
                <small class="orig-req-menu"></small>
              </div>
        `
        let removeParentSpecs = document.createElement('a')
        removeParentSpecs.id = val.id
        removeParentSpecs.href = '#'
        removeParentSpecs.textContent = 'remove'
        removeParentSpecs.setAttribute('onclick', 'event.preventDefault();')
        // tag specs to be removed
        removeParentSpecs.addEventListener('click', (e) => {
          e.target.parentNode.parentNode.parentNode.remove();
          let targ = document.querySelector('#specsToBeRemoved')
          let specsToBeRemoved = []
          if (!targ) {
            targ = document.createElement('input')
            targ.id = 'specsToBeRemoved'
            targ.type = 'hidden'
            const sec = document.querySelector(`#file-attachment-main-dialog-${this.opt.id} > .body`)
            sec.append(targ)
          }

          if(targ.value.length > 1) {
            specsToBeRemoved = JSON.parse(targ.value)
          }
          specsToBeRemoved.push({id:e.target.id, value: 'yes'})
          targ.value = JSON.stringify(specsToBeRemoved)
        })

        html.querySelector('.orig-req-menu').append(removeParentSpecs)

        sectionOthers.append(html)
      })

      // bind other specs
      const otherSpecsBtn = document.querySelector('.add-other-specs-btn:not(.event-binded)')
      if (otherSpecsBtn) {
        otherSpecsBtn.classList.add('event-binded')
        otherSpecsBtn.addEventListener('click', this.__addOtherSpecsField.bind(__proto))
      }
      
      //this.loadPopup()
    })
  }

  render() {
    this.template = document.createElement('section')
    this.template.classList.add('row')
    this.template.style.overflowY = 'auto'

    // custom classes
    if(this.opt.class) this.template.classList.add(...this.opt.class.split(' '))
    
    // template
    this.template.innerHTML = `
      <small class="col-12" style="background:#464a4e;padding:3px;margin-top:50px;position:relative;">
        <ul class="nav col">
          <li class="nav-item">
            <a class="nav-link save-bidding-modal-btn" href="#" data-target="#general-modal" data-popup-toggle="open" onclick="event.preventDefault();" style="color:#ffb80c;">
              <i class="material-icons md-18">save</i> Save
            </a>
          </li>
        </ul>
      </small>

    <div class="col-12">
      <article class="col-xs-12 col-md-12 col-lg-10 offset-lg-1 col-xs-12" style="overflow:auto;padding-bottom: 30px;">
        <section id="reg-notif-area"></section>
        
        <form class="form-horizontal row" name="bidding-request-registration" onsubmit="return false;">
          <section class="col-md-12">
            <section class="recently-attached-prop-section"></section>
            <br/><br/>
            <h2 class="req-form-name">${this.opt.info.name || ''}</h2>
            <small>
    
              <p>
                  <b>Unit Price : </b>
                  <span class="req-currency">${this.opt.info.currency || 'PHP'}</span>
                  <b><span class="req-amount text-danger">
                    <input type="text" placeholder="Enter Amount (Per Item)" class="form-control" autofocus="true" id="proposal-form-amount-per-item" value="${ this.opt.info.amount ? (this.opt.info.amount / this.opt.info.quantity) : ''}">
                  </span></b>
                  
                </p>
    
                <p class="text-muted">
                  <b>Total Amount <small>(Unit Price X Quantity)</small> : </b><br/>
                  <b><span class="req-amount text-danger">
                    <input type="text" placeholder="Enter Amount" class="form-control" autofocus="true" id="proposal-form-amount" readonly="readonly" value="${this.opt.info.amount || 0}">
                  </span>
                  <small class="text-danger">This will be automatically filled out</small>
                  </b>
                  
                </p>
    
                <p>
                  <b>Discount (for all items) : </b>
                  <b><span class="req-amount text-danger">
                    <input type="text" placeholder="Enter Amount" class="form-control" autofocus="true" id="proposal-form-discount" value="${this.opt.info.discount || ''}">
                  </span></b>
                  
                </p>
    
                <p><b>Quantity : </b> <span class="req-quantity-reg">${this.opt.info.quantity || ''}</span> <span class="req-unit-reg">${this.opt.info.unit || ''}</span></p>
    
              </small><br/>
          </section>
    
          <section class="col-12">
            <br/><br/>
            <p>
              <b><span class="text-danger">Specifications</span></b><br/>
              <small>Please fill up all the fields below</small>
    
            </p>
            <div class="specs-section-proposal">
              
            </div>
    
    
            <div class="specs-other">
              <br/><br/><br/>
              <p>
                <b>
                  <span class="text-info">Others 
                    <span class="text-muted">(optional)</span> 
                  </span>
                  <a href="#" onclick="event.preventDefault();" class="add-other-specs-btn"  id="add-other-specs-btn">
                    <i class="material-icons md-18 text-danger">add_circle</i>
                  </a>
                </b><br/>
                <small>
                  These are additional specifications not included in the original bidding request.
                </small>
    
              </p>
    
              <div id="specs-other-section"></div>
    
            </div>
    
    
            <div class="specs-remarks">
              <br/><br/><br/>
              <p>
                <b>
                  <span class="text-info">Remarks
                    <span class="text-muted">(optional)</span> 
                  </span>
                </b><br/>
                <small>
                  Add additional content in your proposal. Please make it short and simple
                </small>
    
                
                <textarea class="form-control" rows="10" style="border:1px solid #ccc !important;" id="proposal-form-remarks">${this.opt.info.remarks || ''}</textarea>
    
              </p>
    
            </div>
    
          </section>
    
        </form>
    
    
      </article>
    </div>`
    //this.__bindListeners () 
    this.__loadAdditionalSettings() 
    // start rendering
    return this.template
  }
}
      
      
      