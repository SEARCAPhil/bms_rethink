import style from './style'

const suppServ = import('../../services/supplier-service')

class template {
  constructor (params) {
    this.__opt = params
  }

  __bindListeners() {
    suppServ.then(res => {
      const __payload = {
        filter: this.__opt.status || 'all',
        page: this.__opt.page || 1,
        token: window.localStorage.getItem('token'),
      }
      new res.default().list(__payload).then(data => {
        if(!data.data) return
        const json = data.data
        const __target = this.template.querySelector('.suppliers-table > tbody')

        json.forEach((val, index) => { 
          const __template = document.createElement('tr')
          __template.innerHTML = `
            <td><a href="#/suppliers/${val.id}/info">${val.id}</a></td>
            <td style="max-width:200px"><a href="#/suppliers/${val.id}/info">${val.name}</a></td>
            <td>${val.alias}</td>
            <td>${val.industry || 'N/A'}</td>
            <td>${val.status == 0 ? 'Active' : '' }</td>

            <!--<td>
              <i class="material-icons text-danger md-18">remove_circle</i>
              <i class="material-icons text-primary md-18">edit</i>
            </td>-->`
          
          __target.append(__template)
        })
      })
    })
  }

  /**
   * Return template as HTMLObject to be rendered in DOM
   */
  async render () {
    this.template = document.createElement('section')
    // template settings
    this.template.setAttribute('style', 'margin-top:45px;padding-bottom:40px;')
    this.template.classList.add('col-lg-12')
    this.template.id = 'supplier-list-section'
    this.template.innerHTML = `
      <style>${style.toString()}</style>
      <article>
        <section class="col col-lg-10 offset-lg-1">
          <input type="text" class="form-control" placeholder="Search" data-role="none" id="search-supplier-input"/>
        </section>

        <section class="col col-lg-10 offset-lg-1"><br/><br/>
          <h5>Total Records: 350</h5>
          <table class="table table-striped suppliers-table">
            <thead>
              <th>#ID</th>
              <th>Company Name</th>
              <th>Alias</th>
              <th>Industry</th>
              <th>Status</th>
            </thead>
            <tbody>

            </tbody>
          </table>
        </section>
      </article>`
    this.__bindListeners()
    return this.template
  }
}


export { template }