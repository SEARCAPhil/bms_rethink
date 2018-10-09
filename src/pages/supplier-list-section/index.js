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
            <td><a href="#/suppliers/${val.id}/info">${val.id}</a><img src="assets/img/company_logo.png" width="90px"/></td>
            <td style="max-width:200px"><a href="#/suppliers/${val.id}/info">${val.name}</a></td>
            <td>${val.alias}</td>
            <td>${val.industry || 'N/A'}</td>
            <td>${val.status == 0 ? 'Active' : '' }</td>
            <td>${val.date_created || 'N/A'}</td>
            <td width="110px">
              <button class="btn btn-light btn-sm"><i class="material-icons text-danger md-18">remove_circle</i></button>
              <button class="btn btn-light btn-sm"><i class="material-icons  md-18">edit</i></button>
            </td>`
          
          __target.append(__template)
        })
      })
    })
  }

  __showPager (totalPage, startPage, endPage, activePageIndex) {
    this.__pageNav = document.createElement('ul')
    this.__pageNav.classList.add('small', 'nav')
    this.__pageNav.innerHTML = `
      <li class="nav-item"><a class="nav-link active" href="#">&laquo;</a></li>
      `
    for (let x = startPage; x <= endPage; x++) {
      this.__pageNav.innerHTML += `<li class="nav-item"><a class="nav-link ${activePageIndex == x ? 'active' :''}" href="#">${x}</a></li>`
    }
    this.__pageNav.innerHTML += `<li class="nav-item"><a class="nav-link ${activePageIndex == totalPage ? 'active' :''}" href="#">&raquo;</a></li>`
    return this.__pageNav
  } 

  __pager () {
    let el = this.template.querySelector('#suppliers-list-page-nav-section')
    return (el.innerHTML = '') | (el.append(this.__showPager(3, 1, 3, 1)))
  }

  __showStats () {
    this.__statSec = document.createElement('section')
    this.__statSec.classList.add('row')
    this.__statSec.id = 'list-of-suppliers-stats-section'
    this.__statSec.innerHTML = `<div class="col-3">
      <div class="media">
        <div class="status-box text-center m-2">
          <p class="mt-3">112</p>
        </div>
        <div class="media-body">
          <h5 class="mt-1 mb-0">Total</h5>
          <small>Number of suppliers</small>
        </div>
      </div>
    </div>

    <div class="col-3">
      <div class="media">
        <div class="status-box text-center m-2">
          <p class="mt-3">0</p>
        </div>
        <div class="media-body">
          <h5 class="mt-1 mb-0">Blocked</h5>
          <small>Number of blocked suppliers</small>
        </div>
      </div>
    </div>`

    this.template.querySelector('#list-of-suppliers-stats-section').replaceWith(this.__statSec)
  }

  /**
   * Return template as HTMLObject to be rendered in DOM
   */
  async render () {
    this.template = document.createElement('section')
    // template settings
    this.template.setAttribute('style', 'margin-top:25px;padding-bottom:40px;')
    this.template.classList.add('col-lg-12')
    this.template.id = 'supplier-list-section'
    this.template.innerHTML = `
      <style>${style.toString()}</style>
      <article>
        <section id="suppliers-list-banner" class="col-12">
          <div class="media">
            <i class="material-icons m-2 md-36">store</i>
            <div class="media-body">
              <h3 class="mt-1">List of Suppliers</h3>
              <small>Suppliers you have been added to the system</small>
            </div>
          </div>
        </section>
        <section class="row mb-5">
          <div class="col-12">
            <input type="text" class="form-control" placeholder="Search" data-role="none" id="search-supplier-input"/>
          </div>
        </section>

        <section class="row" id="list-of-suppliers-stats-section"></section>

        <section class="col-12"><br/><br/>
          <small><p>Showing 3 out of 3</p></small>
          <table class="table table-striped table-bordered suppliers-table">
            <thead>
              <th>#ID</th>
              <th>Company Name</th>
              <th>Alias</th>
              <th>Industry</th>
              <th>Status</th>
              <th width="150px">Date Created</th>
              <th>Actions</th>
            </thead>
            <tbody>

            </tbody>
          </table>
        </section>

        <section class="d-flex flex-row-reverse">
        <div id="suppliers-list-page-nav-section"></div> 
        <div class="m-2 text-muted small">Page</div>
        </section>
      </article>`
    this.__showStats()
    this.__bindListeners()
    this.__pager()
    return this.template
  }
}


export { template }