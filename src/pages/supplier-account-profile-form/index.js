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



  __loadCreateAction () {
    /*import('./actions/create').then(loader => {
      let btn = this.template.querySelector('.add-supplier-button')
      btn.addEventListener('click', loader.register)
      btn.id = this.opt.id
    })*/
  }
  
  __bindListeners () {

    this.__bindSubmit()
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
                      <span style="color:#009688;">Account Information </span> 
                    </b>
                  </h4>

                <p class="text-muted"><small>&emsp;Please provide factual information</small></p><br/>
              </p>

              <p> 
                <b>Last Name * :</b> <br/>
                <input type="text" name="name" class="form-control" id="name" placeholder="Southeast Asian Regional Center . . ." value="${this.__info.name || ''}"  required autofocus>
              </p>

              <p> 
                <b>First Name :</b> <br/>
                <input type="text" name="alias" class="form-control" id="alias" placeholder="SEARCA" value="${this.__info.alias || ''}"  required autofocus>
              </p>

              <p class="mt-4"> 
                <b>Position</b> <br/>
                <input type="text" name="position" class="form-control" id="position" value="${this.__info.website || ''}" placeholder="http://www.yourwebsite.com">
              </p>

              <p class="mt-4"> 
                <b>Department</b> <br/>
                <input type="text" name="industry" class="form-control" id="industry" value="${this.__info.industry || ''}" placeholder="ICT, Construction , etc ... (Please separate using comma)">
              </p>

              <p class="mt-4"> 
                <b>Department Alias</b> <br/>
                <input type="text" name="website" class="form-control" id="website" value="${this.__info.website || ''}" placeholder="http://www.yourwebsite.com">
              </p>              
            
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
