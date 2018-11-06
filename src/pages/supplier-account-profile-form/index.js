import style from '../../components/general-style/circle-marker'
const BiddingServ = import('../../services/supplier-account-service')


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
    window.location = `#/suppliers/accounts/${id}/info`
    setTimeout(() => window.location.reload() ,50)
  }

  __sendError (message) {
    alert(message || 'Oops something went wrong. Please try again later.')
  }


  async __send (__payload) {
    const __serv = (await BiddingServ).default
    const __btn = this.template.querySelector('.add-profile-button')

    // spinner
		import('../../components/app-spinner').then(loader => {
			return new loader.default().show({target: '.supplier-module-container'}).then(t => t.template.show())
    })
    // request
    new __serv().createProfile(__payload).then(res => { 
      document.querySelector('.spinner').classList.remove('open')
      __btn.removeAttribute('disabled')
      // return original id or newly created ID from DB
      return (res.data && (!res.message)) ? this.__sendSuccess(this.opt.action === 'update' ? this.opt.id : res.data) : this.__sendError(res.message)
    }).catch(err => console.log(err))
  }


  __bindSubmit () {
    let __name = this.template.querySelector('#name')
    let __btn = this.template.querySelector('.add-profile-button')
    
    this.template.querySelector('[name="account-profile-reg-form"]').addEventListener('submit', (e) => {  
      // disable button
      __btn.setAttribute('disabled', 'disabled')
      
      // required value
      if (!__name.value.length) return
      let __formData = new FormData(e.target)
      
      if(this.opt.action === 'create') __formData.append('id', this.opt.id)

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
      
        <form class="form-horizontal row pb-5" name="account-profile-reg-form" onsubmit="event.preventDefault();" enctype="multipart/form-data" method="POST">
          ${this.opt.action === 'update' ? '<input type ="hidden" name="id" value="'+this.__info.id+'"/><input type ="hidden" name="action" value="update"/>' : ''}
          ${this.opt.action === 'create' ?'<input type ="hidden" name="action" value="create"/>' : ''}
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
              ${this.opt.action === 'create' ?
              `
              <h3>Login Information</h3>
              <p> 
                <b>Username * :</b> <br/>
                <input type="email" name="username" class="form-control" id="username" placeholder="please provide email address" required autofocus>
              </p>

              <p> 
                <b>Password * :</b> <br/>
                <input type="password" name="password" class="form-control" id="password" placeholder="********"  required>
              </p>

              <p> 
                <b>Confirm Password* :</b> <br/>
                <input type="password" name="confirm_password" class="form-control" id="confirm_password" placeholder="********"   required>
              </p><div class="col-12 mt-5"></div><h3>Personal Information</h3>` : '' }

              <p> 
                <b>Last Name * :</b> <br/>
                <input type="text" name="name" class="form-control" id="name" placeholder="Southeast Asian Regional Center . . ." value="${this.__info.last_name || ''}"  required autofocus>
              </p>

              <p> 
                <b>First Name :</b> <br/>
                <input type="text" name="first_name" class="form-control" id="first_name" placeholder="SEARCA" value="${this.__info.first_name || ''}"  required autofocus>
              </p>

              <p class="mt-4"> 
                <b>Position</b> <br/>
                <input type="text" name="position" class="form-control" id="position" value="${this.__info.position || ''}" placeholder="http://www.yourwebsite.com">
              </p>

              <p class="mt-4"> 
                <b>Department</b> <br/>
                <input type="text" name="department" class="form-control" id="department" value="${this.__info.department || ''}" placeholder="">
              </p>

              <p class="mt-4"> 
                <b>Department Alias</b> <br/>
                <input type="text" name="department_alias" class="form-control" id="department_alias" value="${this.__info.department_alias || ''}" placeholder="http://www.yourwebsite.com">
              </p>              
            
          </section>
          
          <section class="col col-md-12">
            <button class="btn btn-dark add-profile-button float-right">SUBMIT <i class="material-icons">navigate_next</i></button>
          </section>
        </form>
      </article>`
    this.__bindListeners()
    return this.template
  }
}
