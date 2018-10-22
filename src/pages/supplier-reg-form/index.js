import style from '../../components/general-style/circle-marker'
const BiddingServ = import('../../services/supplier-service')


export default class {
  constructor (opt) {
    this.opt = opt
    this.template = {}
    this.__info = {}
    this.__contactsToRemove = []
    this.__contactsToSend = []
    return this.render() 
  }

  __sendSuccess (id) {
    window.location = `#/suppliers/${id}/info`
    setTimeout(() => window.location.reload() ,50)
  }

  __sendError () {
    alert('Oops something went wrong. Please try again later.')
  }


  async __send (__payload) {
    const __serv = (await BiddingServ).default
    const __btn = this.template.querySelector('.add-supplier-button')

    // spinner
		import('../../components/app-spinner').then(loader => {
			return new loader.default().show({target: '.supplier-module-container'}).then(t => t.template.show())
    })
    // request
    new __serv().create(__payload).then(res => { 
      document.querySelector('.spinner').classList.remove('open')
      __btn.removeAttribute('disabled')
      return res.data ? this.__sendSuccess(res.data) : this.__sendError()
    }).catch(err => console.log(err))
  }


  __showUploadError () {
    alert('Please check your image size and file type!')
  }

  __bindUploadPhoto () {
    const allowedFileType = ['png', 'jpg', 'jpeg', 'bmp']
    let __input = this.template.querySelector('#logo')
    let __target = this.template.querySelector('#logo-section')
    let __reader = new FileReader()
    

    __target.addEventListener('click', () => __input.click() )
    __input.addEventListener('change', (e) => {
      let __allowUpload = false;

      __reader.onload = (f) => {
        __target.style.background = `url(${f.target.result}) center center no-repeat`
        __target.style.backgroundSize = 'cover'
        __target.innerHTML = ''
        
      }
      // filter
      allowedFileType.forEach ((val, index) => {  return parseInt(e.target.files[0].type.toLowerCase().indexOf(val))!=-1 ? (__allowUpload = true) : '' })
      setTimeout(() => { return __allowUpload ? __reader.readAsDataURL(e.target.files[0]) : this.__showUploadError() },10)
    })
  }

  __bindChangeLogo (logo) {
    let __targ = this.template.querySelector('#logo-section')
    __targ.style.background = `url(${logo}) center center no-repeat`
    __targ.style.backgroundSize = 'cover'
  }

  __bindSubmit () {
    let __name = this.template.querySelector('#name')
    let __btn = this.template.querySelector('.add-supplier-button')
    
    this.template.querySelector('[name="supplier-reg-form"]').addEventListener('submit', (e) => {  
      // disable button
      __btn.setAttribute('disabled', 'disabled')
      // contacts to be added or updated
      this.__bindGetContactsData ().then(res => {
        res.forEach((el, index) => __formData.append('contacts[]', el))
      })

      // required value
      if (!__name.value.length) return
      let __formData = new FormData(e.target)
      // to remove contacts
      __formData.append('contacts_to_remove', this.__contactsToRemove)

      // send AJAX
      this.__send(__formData)
    })
  }

  __addContactField (e) {
    e.target.remove()
    this.template.querySelector('.contacts-section').innerHTML+= ` <div class="contact-fieldset row"><div class="col-3 mt-4">
      <select class="form-control" name="contact_type[]">
        <option>Phone</option>
        <option>Mobile</option>
        <option>Email</option>
      </select>
    </div>
    <div class="col-8">
      <input class="form-control" placeholder="enter value" name="contact_value[]"/>
    </div>
    <div class="col-1">
      <i class="material-icons green  add-contact-field-btn">add_circle</i>
    </div></div>`
  this.__bindAddContactField ()
  }
  

  __removeContactField (e) {
    let __parent = e.target.parentNode.parentNode
    let __id = __parent.getAttribute('data-resources')
    __parent.remove()
    this.__contactsToRemove.push(__id)
    this.__bindRemoveContactField ()
  }


  __bindShowContacts () {
    if(!this.opt) return
    const __targ = this.template.querySelector('.contacts-section')
    this.__info.contact_info.forEach((el, index) => {
      let __t = __targ.innerHTML
      __targ.innerHTML= `<div class="contact-fieldset row" data-resources="${el.id}">
        <div class="col-3">
          <select class="form-control mb-4" name="contact_type[]">
            <option value="${el.type}">${el.type}(Selected)</option>
            <option>Phone</option>
            <option>Mobile</option>
            <option>Email</option>
          </select>
        </div>
        <div class="col-8">
          <input class="form-control" placeholder="enter value" name="contact_value[]" value="${el.value}"/>
        </div>
        <div class="col-1">
        <i class="material-icons green add-contact-field-btn">add_circle</i> 
        <i class="material-icons remove-contact-field-btn text-danger">remove_circle</i>
        </div>
      </div>`
      __targ.innerHTML+= __t
    })
  }

  __bindGetContactsData () {
    let __targ = this.template.querySelectorAll('.contact-fieldset')
    this.__contactsToSend = []

    return new Promise((resolve, reject) => {
      __targ.forEach((el, index) => {
        let type = el.querySelector('select[name="contact_type[]"]').value
        let value = el.querySelector('input[name="contact_value[]"]').value
        let id = el.getAttribute('data-resources')
        let __arr = [type, value, id]
        // add to queue
        this.__contactsToSend.push(__arr)
        resolve(this.__contactsToSend)
      })
    })
  }
  __bindAddContactField () {
    const __proto = Object.assign({__proto__ : this.__proto__}, this)
    this.template.querySelectorAll('.add-contact-field-btn').forEach((el, index) => {
      el.addEventListener('click', this.__addContactField.bind(__proto))
    })
  }

  __bindRemoveContactField () {
    const __proto = Object.assign({__proto__ : this.__proto__}, this)
    this.template.querySelectorAll('.remove-contact-field-btn').forEach((el, index) => {
      el.addEventListener('click', this.__removeContactField.bind(__proto))
    })
  }

  __loadUpdateAction () {
    /*import('./actions/update').then(loader => {
      let btn = this.template.querySelector('.add-supplier-button')
      btn.addEventListener('click', loader.update)
      btn.id = this.__info.id
      btn.biddingId = this.__info.bidding_id
    })*/
  }

  __loadCreateAction () {
    /*import('./actions/create').then(loader => {
      let btn = this.template.querySelector('.add-supplier-button')
      btn.addEventListener('click', loader.register)
      btn.id = this.opt.id
    })*/
  }
  
  __bindListeners () {
    this.__bindUploadPhoto ()
    this.__bindSubmit()
    this.__bindShowContacts()
    this.__bindAddContactField()
    this.__bindRemoveContactField ()
    
    /*if (this.opt.action === 'update') this.__loadUpdateAction()
    if (this.opt.action === 'create') this.__loadCreateAction()*/

  }

  __getInfo() { 
    return new Promise((resolve, reject) => { 
      if(!this.opt) return false | resolve({})
      import('./actions/update').then(loader => {
       loader.view({
          id: this.opt.id,
          token: window.localStorage.getItem('token')
        }).then(json => resolve(json.data[0])).catch(err => reject(err))

        //this.template.querySelector('.add-supplier-button').addEventListener('click', loader.update)
      })
    })
  }

  /**
   * Return template as HTMLObject to be rendered in DOM
   */
  async render () {
    this.__info = (await this.__getInfo()) || {}
    this.template = document.createElement('section')
    this.template.classList.add('row')
    this.template.style.height = '100%'
    this.template.innerHTML = `
      <style>${style.toString()}</style>
      <article class="col-xs-12 col-md-12 col-lg-8 offset-lg-2 col-xs-12" style="margin-top: 10vh;padding-bottom: 30px;">
        <section id="reg-notif-area"></section>
      
        <form class="form-horizontal row pb-5" name="supplier-reg-form" onsubmit="event.preventDefault();" enctype="multipart/form-data" method="POST">
          ${this.__info ? '<input type ="hidden" name="id" value="'+this.__info.id+'"/><input type ="hidden" name="action" value="update"/>' : '<input type ="hidden" name="action" value="create"/>'}
          <section class="col-md-12">
              <p>
                <span class="text-info">
                  <h4>
                    <span class="circle-marker" style="width:30px;height:30px;">
                      <i class="material-icons md-24">add_shopping_cart</i>
                    </span>
                    <b>
                      <span style="color:#009688;">Company Information </span> 
                    </b>
                  </h4>

                <p class="text-muted"><small>&emsp;Please provide factual information</small></p><br/>
              </p>

              <section class="row col-12 mb-3">
                <div style="float: left; width: 150px; height: 150px; background: #ccc;" id="logo-section">
                  <center class="m4 text-muted"><small>Click to change company logo</small></center>
                </div>
                ${this.__info.logo ? '<style>#logo-section { background: url("'+this.__info.logo+'") center center cover no-repeat !important;}</style>' : ''}
                <input type="file" name="logo" id="logo" class="hide"/>
              </section>

              <p> 
                <b>Company Name * :</b> <br/>
                <input type="text" name="name" class="form-control" id="name" placeholder="Southeast Asian Regional Center . . ." value="${this.__info.name || ''}"  required autofocus>
              </p>

              <p> 
                <b>Alias * :</b> <br/>
                <input type="text" name="alias" class="form-control" id="alias" placeholder="SEARCA" value="${this.__info.alias || ''}"  required autofocus>
              </p>

              <p class="mt-4"> 
                <b>Industry</b> <br/>
                <input type="text" name="industry" class="form-control" id="industry" value="${this.__info.industry || ''}" placeholder="ICT, Construction , etc ... (Please separate using comma)">
              </p>

              <p class="mt-4"> 
                <b>Website</b> <br/>
                <input type="text" name="website" class="form-control" id="website" value="${this.__info.website || ''}" placeholder="http://www.yourwebsite.com">
              </p>

              <section> 
                <p><b>About</b> <br/></p>
                <textarea class="w-100" rows="10" id="about" name="about">${this.__info.about || ''}</textarea>
              </section>

              <section class="mt-5 mb-3">
                <span class="text-info">
                  <h5>
                    <span class="circle-marker" style="width:30px;height:30px;">
                      <i class="material-icons md-24">add_shopping_cart</i>
                    </span>
                    <b>
                      <span style="color:#009688;">Contact Information </span> 
                    </b>
                  </h5>

                <p class="text-muted"><small>&emsp;Please provide contact details for future reference</small></p><br/>
              </section>

              <section class="mb-5 contacts-section">
                <div class="contact-fieldset row">
                  <div class="col-3">
                    <select class="form-control" name="contact_type[]">
                      <option>Phone</option>
                      <option>Mobile</option>
                      <option>Email</option>
                    </select>
                  </div>
                  <div class="col-8">
                    <input class="form-control" placeholder="enter value" name="contact_value[]"/>
                  </div>
                  <div class="col-1">
                    <i class="material-icons green add-contact-field-btn">add_circle</i>
                  </div>
                </div>
              </section>

              
            
          </section>
          
          <section class="col col-md-12">
            <button class="btn btn-dark add-supplier-button float-right">SUBMIT <i class="material-icons">navigate_next</i></button>
          </section>
        </form>
      </article>`
    this.__bindListeners()
    this.__info.logo ? this.__bindChangeLogo (this.__info.logo) : ''
    return this.template
  }
}
