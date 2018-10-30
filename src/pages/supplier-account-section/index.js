import bannerStyle from '../supplier-list-section/style'
import style from './style'

const accServ = import('../../services/supplier-account-service')


export default class {
  constructor (params) {
    this.__opt = params
    return this.render ()
  }

  __generateTableHeader () {
    return `<table class="table accounts-table">
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
      </tbody>
    </table>`
  }

  __generateTableListData (json, target) {
    const __target = this.template.querySelector(target)
    return new Promise((resolve, reject) => {
      json.forEach((val, index) => {  
        const __template = document.createElement('tr')
        let __stat = 'Available'

        switch(val.status) {
          case 0:
            __stat = 'Available'
            break
          
          case 1:
            __stat = 'Removed'
            break
          
          case 2:
            __stat = 'Blocked'
            break
        }
        __template .id = `accounts-list-${val.id}`
        __template.innerHTML = `
          <tr>
            <td><div class="text-center" style="float: left; width: 35px; height: 35px; border-radius: 50%; margin-right: 10px; overflow: hidden;background:#5d5d5d;color:#fff;">JD</div></td>
            <td><a href="#/suppliers/accounts/${val.id}/info">${val.id}</a></td>
            <td style="max-width:200px"><a href="#/suppliers/accounts/${val.id}/info">${val.profile_name || 'Not Set'}</a></td>
            <td>${val.username || ''}</td>
            <td>${val.department || ''}</td>
            <td>${val.department_alias || ''}</td>
            <td>${val.position || ''}</td>
            <td>${__stat}</td>
          </tr>`
          
        __target.append(__template)
        resolve(json)
      })
    })
  }


  async __list () {
    const ApiConfig = await import ('../../config/api').default
    return new Promise ((resolve, reject) => {
      accServ.then(res => {
        const __payload = {
          page: this.__opt.page || 1,
          id: this.__opt.id,
          token: window.localStorage.getItem('token'),
        }
        new res.default().list(__payload).then(data => {
          if(!data.data) return
          const json = data.data
          const __target = this.template.querySelector('.suppliers-table > tbody')

          this.__generateTableListData (json.accounts, '.accounts-table > tbody')
          resolve(json)
        })
      }
    )})
  }

  __showTotalAccountCount (total) {
    this.template.querySelector('#total-accounts-count-section').innerHTML = total
  }

  __showPager (totalPage, startPage, endPage, activePageIndex) {
    this.__pageNav = document.createElement('ul')
    this.__pageNav.classList.add('small', 'nav')


    this.__pageNavFirst = document.createElement('li')
    this.__pageNavFirst.classList.add('nav-item')
    this.__pageNavFirst.innerHTML = `<a class="nav-link active" href="#/suppliers/${this.__opt.id}/accounts/page/1">&laquo;</a>`

    this.__pageNav.append(this.__pageNavFirst)

    for (let x = startPage; x <= endPage; x++) {
      let pageItem = document.createElement('li')
      pageItem.classList.add('nav-item')
      pageItem.innerHTML = `<a class="nav-link ${activePageIndex == x ? 'active' :''}" href="#/suppliers/${this.__opt.id}/accounts/page/${x}">${x}</a>`

      this.__pageNav.append(pageItem)

    }
    this.__pageNavFirst = document.createElement('li')
    this.__pageNavFirst.classList.add('nav-item')
    this.__pageNavFirst.innerHTML = `<a class="nav-link active" href="#/suppliers/${this.__opt.id}/accounts/page/${totalPage}">&raquo;</a>`

    this.__pageNav.append(this.__pageNavFirst)

    return this.__pageNav
  } 

  __pager (json ) {
    const el = this.template.querySelector('#accounts-list-page-nav-section')
    const totalPage = json.pages
    const currentPage = json.current_page

    return (el.innerHTML = '') | (el.append(this.__showPager(totalPage < 1 ? 1 : totalPage, 1, totalPage < 1 ? 1 : totalPage , currentPage|| 1)))
  }

  __bindSearch () {
    import('./actions/search').then(loader => {
      return new loader.default({
        root: this.template,
        selector: '#search-account-input',
        id: this.__opt.id,
        singleton: this
      })
    })
  }


  __bindListeners () {
    // show page navigation
    this.__list ().then(json => this.__pager(json) | this.__showTotalAccountCount (json.total))
    this.__bindSearch ()
  }
  

  /**
   * Return template as HTMLObject to be rendered in DOM
   */
  render () {
    this.template = document.createElement('section')
    this.template.classList.add('col', 'col-lg-10', 'offset-lg-1')
    this.template.id = 'account-list-section'
    this.template.innerHTML = `
      <style>${bannerStyle.toString()}</style>
      <style>${style.toString()}</style>
        <style>
          .status-o365-box {
            background: url('assets/img/o365.png') center center no-repeat;
            background-size: contain;
          }
        </style>
        <section id="suppliers-list-banner" class="col-12">
          <div class="media">
            <i class="material-icons m-2 md-36">account_circle</i>
            <div class="media-body">
              <h3 class="mt-1">Register Account</h3>
              <small>Register or connect accounts under this particular supplier</small>
            </div>
          </div>
        </section>
        
        <section class="row">
          <div class="col-4" style="background:#f7f7f7;" onclick="window.location.hash='/suppliers/accounts/forms/registration/profile/${this.__opt.id}'">
            <div class="media">
              <div class="status-box text-center m-2">
                <p class="mt-3" id="total-all-section"><i class="material-icons">add</i></p>
              </div>
              <div class="media-body">
                <h5 class="mt-3 mb-0">Standard</h5>
                <small class="text-muted">Add new regular user account</small>
              </div>
            </div>
          </div>

          <div class="col-4">
            <div class="media">
              <div class="status-box status-o365-box text-center m-2">
                <p class="mt-3">0</p>
              </div>
              <div class="media-body">
                <h5 class="mt-3 mb-0">Office365</h5>
                <small>Connect office365 account</small>
              </div>
            </div>
          </div>
        </section>

        <section class="row mb-5 mt-5">
          <div class="col-12">
            <input type="text" class="form-control" placeholder="Search" data-role="none" id="search-account-input"/>
          </div>
        </section>

        <section class="row" id="list-account-of-stats-section"></section>
        <section class="row col-12 hide" id="account-search-section"></section>


        <article id="list-account-table-container">
          <p class="float-right text-muted">Total Records: <span id="total-accounts-count-section"></span></p>
          
          <table class="table accounts-table">
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
            </tbody>
          </table>
          <section class="d-flex flex-row-reverse">
            <div id="accounts-list-page-nav-section"></div> 
            <div class="m-2 text-muted small">Page</div>
          </section>
        </article`
    this.__bindListeners()
    return this.template
  }
}
