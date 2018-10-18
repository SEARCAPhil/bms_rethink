import style from '../../components/general-style/circle-marker'
const BiddingServ = import('../../services/supplier-service')


export default class {
  constructor (opt) {
    this.opt = opt
    this.template = {}
    this.__info = {}
    return this.render() 
  }

  __sendSuccess () {
    document.querySelector('.spinner').classList.remove('open')
  }

  __sendError () {
    alert('Oops something went wrong. Please try again later.')
  }

  async __send (__payload) {
    const __serv = (await BiddingServ).default
    // spinner
		import('../../components/app-spinner').then(loader => {
			return new loader.default().show({target: '.supplier-module-container'}).then(t => t.template.show())
    })
    
    new __serv().create(__payload).then(res => { 
      return res.data ? this.__sendSuccess() : this.__sendError()
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

  __bindSubmit () {
    let __name = this.template.querySelector('#name')
    let __industry = this.template.querySelector('#industry')
    let __about = this.template.querySelector('#about')
    let __website = this.template.querySelector('#website')
    
    this.template.querySelector('[name="supplier-reg-form"]').addEventListener('submit', (e) => {
      if (!__name.value.length) return
      let __formData = new FormData(e.target)
      __formData.append('action', 'create')
      this.__send(__formData)
    })
  }

  __addContactField (e) {
    e.target.remove()
    this.template.querySelector('.contacts-section').innerHTML+= ` <div class="col-3 mt-3">
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
    </div>`
  this.__bindAddContactField ()
  }

  __bindAddContactField () {
    const __proto = Object.assign({__proto__ : this.__proto__}, this)
    this.template.querySelectorAll('.add-contact-field-btn').forEach((el, index) => {
      el.addEventListener('click', this.__addContactField.bind(__proto))
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
    this.__bindAddContactField()
    /*if (this.opt.action === 'update') this.__loadUpdateAction()
    if (this.opt.action === 'create') this.__loadCreateAction()*/

  }

  __getInfo() {
    /*return new Promise((resolve, reject) => {
      import('./actions/update').then(loader => {
       loader.view({
          id: this.opt.id,
          token: window.localStorage.getItem('token')
        }).then(json => resolve(json[0])).catch(err => reject(err))

        //this.template.querySelector('.add-supplier-button').addEventListener('click', loader.update)
      })
    })*/
  }

  /**
   * Return template as HTMLObject to be rendered in DOM
   */
  async render () {
    //this.__info = (await this.__getInfo()) || {}
    
    this.template = document.createElement('section')
    this.template.classList.add('row')
    this.template.style.height = '100%'
    this.template.innerHTML = `
      <style>${style.toString()}</style>
      <article class="col-xs-12 col-md-12 col-lg-8 offset-lg-2 col-xs-12" style="margin-top: 10vh;padding-bottom: 30px;">
        <section id="reg-notif-area"></section>
      
        <form class="form-horizontal row pb-5" name="supplier-reg-form" onsubmit="event.preventDefault();" enctype="multipart/form-data" method="POST">
          <section class="col-md-12">
              <p>
                <span class="text-info">
                  <h5>
                    <span class="circle-marker" style="width:30px;height:30px;">
                      <i class="material-icons md-24">add_shopping_cart</i>
                    </span>
                    <b>
                      <span style="color:#009688;">Company Information </span> 
                    </b>
                  </h5>

                <p class="text-muted"><small>&emsp;Please provide factual information</small></p><br/>
              </p>

              <section class="row col-12 mb-3">
                <div style="float: left; width: 150px; height: 150px; background: #ccc;" id="logo-section">
                  <center class="m4 text-muted"><small>Click to change company logo</small></center>
                </div>
                <input type="file" name="logo" id="logo" class="hide"/>
              </section>

              <p> 
                <b>Company Name * :</b> <br/>
                <input type="text" name="name" class="form-control" id="name" placeholder="Southeast Asian Regional Center . . ."  required autofocus>
              </p>

              <p class="mt-4"> 
                <b>Industry</b> <br/>
                <input type="text" name="industry" class="form-control" id="industry" placeholder="ICT, Construction , etc ... (Please separate using comma)">
              </p>

              <p class="mt-4"> 
                <b>Website</b> <br/>
                <input type="text" name="website" class="form-control" id="website" placeholder="http://www.yourwebsite.com">
              </p>

              <section> 
                <p><b>About</b> <br/></p>
                <textarea class="w-100" rows="10" id="about" name="about"></textarea>
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

              <section class="row mb-5 contacts-section"> 
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
              </section>

              
            
          </section>
          
          <section class="col col-md-12">
            <button class="btn btn-dark add-supplier-button float-right">SUBMIT <i class="material-icons">navigate_next</i></button>
          </section>
        </form>
      </article>`
    this.__bindListeners()
    return this.template
  }
}
