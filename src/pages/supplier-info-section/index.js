import style from './style'
const suppServ = import('../../services/supplier-service')

export default class {
  constructor (params) {
    this.__opt = params
  }

  __getDetails () {
    return new Promise((resolve, reject) => {
      suppServ.then(res => {
        const __payload = {
          id: this.__opt.id,
          token: window.localStorage.getItem('token'),
        }
        new res.default().view(__payload).then(data => {
          resolve(data)
        })
      })
    })
  }

  __setDetails (res) {
    let __industries = ''
    let __contacts = ''
    
    // get industries
    res.industry.split(',').forEach((el, index) => {
      __industries+= `<span class="badge badge-dark">${el}</span>&emsp;`
    })

    // get contact info
    res.contact_info.forEach((el, index) => __contacts+=`<span class="badge badge-dark mr-2"><i class="material-icons md-18">${el.type == 'phone' ? 'phone' : (el.type == 'email' ? 'email' : 'smartphone')}</i>${el.value}</span>`)
    

    return `
      <div class="col-12 text-center">
        <img src="${res.logo}" onerror="this.remove();" width="100%" style="max-width: 350px;" class="p-2">
      </div>
      <h3><b>${res.alias}</b></h3>
      <small>${res.name}<br/>
        <span class="text-muted"><i class="material-icons">location_on</i> ${res.location || 'Location not set'}</span><br/>
        <span class="text-muted"><i class="material-icons">public</i> ${res.website || 'Website not set'}</span>
      </small>
      <hr/>
      <small><p>Contact Information</p></small>${__contacts.length ? __contacts : '<span class="text-muted">No contact details</span>'}<br/><br/>
      <small><p>Industries</p></small>${__industries}<br/><br/>
      
      <br/>
      
      <p class="text-justify pb-5">${res.about || 'No details available'}</p>`
  }

  __setNotFound () {
    return `
      <h3><b>Not Found</b></h3><br/>
      <p>The page you are requesting is currently not available. Please try again later.</p>
      <br/>`
  }

  async __about () {
    const __targ = this.template.querySelector('suppliers-section-container')
    const __temp = document.createElement('section')
    const __details = await this.__getDetails ()
    __temp.classList.add('col', 'col-lg-10', 'offset-lg-1')
    __temp.innerHTML = ''

    try {
      __temp.innerHTML = this.__setDetails(__details.data[0])
    } catch (e) {
      __temp.innerHTML = this.__setNotFound()
    }
    __targ.append(__temp)
  }


  __accounts () {
    const __targ = this.template.querySelector('suppliers-section-container')
    const __temp = document.createElement('section')
    __temp.classList.add('col', 'col-lg-10', 'offset-lg-1')
    __temp.innerHTML = `
        <section>
          <input type="text" class="form-control" placeholder="Search" data-role="none" id="search-account-input"/>
        </section><br/><br/>

        <h5>Total Records: 150</h5>
        <p><a href="#" class="text-danger">Add New <i class="material-icons">add_circle</i></a></p>

        <table class="table suppliers-table">
          <thead>
            <th></th>
            <th>#ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Department Alias</th>
            <th>Position</th>
            <th>Status</th>
          </thead>
          <tbody>
            <tr>
              <td><div class="text-center" style="float: left; width: 35px; height: 35px; border-radius: 50%; margin-right: 10px; overflow: hidden;background:#5d5d5d;color:#fff;">JD</div></td>
              <td><a href="#/suppliers//info">150</a></td>
              <td style="max-width:200px"><a href="#/suppliers//info">John Mark Doe</a></td>
              <td>jmd@remote.org</td>
              <td>Information Technology Department</td>
              <td>ITD</td>
              <td>Programmer</td>
              <td>Active</td>
            </tr>
            <tr>
              <td><div class="text-center" style="float: left; width: 35px; height: 35px; border-radius: 50%; margin-right: 10px; overflow: hidden;background:#5d5d5d;color:#fff;">JD</div></td>
              <td><a href="#/suppliers//info">150</a></td>
              <td style="max-width:200px"><a href="#/suppliers//info">John Mark Doe</a></td>
              <td>jmd@remote.org</td>
              <td>Information Technology Department</td>
              <td>ITD</td>
              <td>Programmer</td>
              <td>Active</td>
            </tr>
            <tr>
              <td><div class="text-center" style="float: left; width: 35px; height: 35px; border-radius: 50%; margin-right: 10px; overflow: hidden;background:#5d5d5d;color:#fff;">JD</div></td>
              <td><a href="#/suppliers//info">150</a></td>
              <td style="max-width:200px"><a href="#/suppliers//info">John Mark Doe</a></td>
              <td>jmd@remote.org</td>
              <td>Information Technology Department</td>
              <td>ITD</td>
              <td>Programmer</td>
              <td>Active</td>
            </tr>
            <tr>
              <td><div class="text-center" style="float: left; width: 35px; height: 35px; border-radius: 50%; margin-right: 10px; overflow: hidden;background:#5d5d5d;color:#fff;">JD</div></td>
              <td><a href="#/suppliers//info">150</a></td>
              <td style="max-width:200px"><a href="#/suppliers//info">John Mark Doe</a></td>
              <td>jmd@remote.org</td>
              <td>Information Technology Department</td>
              <td>ITD</td>
              <td>Programmer</td>
              <td>Active</td>
            </tr>
            <tr>
              <td><div class="text-center" style="float: left; width: 35px; height: 35px; border-radius: 50%; margin-right: 10px; overflow: hidden;background:#5d5d5d;color:#fff;">JD</div></td>
              <td><a href="#/suppliers//info">150</a></td>
              <td style="max-width:200px"><a href="#/suppliers//info">John Mark Doe</a></td>
              <td>jmd@remote.org</td>
              <td>Information Technology Department</td>
              <td>ITD</td>
              <td>Programmer</td>
              <td>Active</td>
            </tr>
          </tbody>
        </table>`
    __targ.innerHTML = ''
    __targ.append(__temp)
  }

  __bindListeners() {
    this.__opt.active == 'about' ? this.__about() : ''
    this.__opt.active == 'accounts' ? this.__accounts() : ''
  }

  /**
   * Return template as HTMLObject to be rendered in DOM
   */
  async render () {
    this.template = document.createElement('section')
    // template settings
    this.template.setAttribute('style', 'margin-top:45px;padding-bottom:40px;height:100vh;overflow-y:auto;')
    this.template.classList.add('col-lg-12')
    this.template.id = 'supplier-section'
    this.template.innerHTML = `
      <style>${style.toString()} </style>
      <section>
        <supplier-info-menu></supplier-info-menu>
        <br/><br/>
        <suppliers-section-container></suppliers-section-container>
      </section>`

    this.showMenu({
      id: this.__opt.id,
      target: this.template.querySelector('supplier-info-menu'),
      menus: ['back', 'about', 'products', 'accounts'],
      active: this.__opt.active || 'about'
    })
    this.__bindListeners()
    return this.template
  }

    /**
   * Show menu based on payload
   * 
   * @param {Object} opt 
   */
  showMenu (opt) {
    return new Promise((resolve, reject) => {
      import('../../components/supplier-info-menu').then(res => {
        return new res.default(opt).then((html) => {
          const targ = opt.target
          if (targ) {
            targ.replaceWith(html)
          } else { 
            document.querySelector('#supplier-info-menu').replaceWith(html)
          }
          resolve()
        })
      })
    }) 
  }
}
