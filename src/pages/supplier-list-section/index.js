import style from './style'


const suppServ = import('../../services/supplier-service')


class template {
  constructor (params) {
    this.__opt = params
    this.__timeout = {}
  }

  __loadPopup () {
    const popupes = import('../../components/popup-es')
    const popupesStyle = import('../../components/popup-es/style')

    // enable popup
    popupesStyle.then(css => {
      const style = document.createElement('style')
      style.id = 'popup-es-style'
      style.innerHTML = css.default.toString()
      if(!document.querySelector('#popup-es-style')) document.head.append(style)
    })

    popupes.then(loader => new loader.default())
  
  }

  __generateTableHeader () {
    return `<table class="table suppliers-table">
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
    </table>`
  }

  __generateTableListData (json, target) {
    const __target = this.template.querySelector(target)
    return new Promise((resolve, reject) => {
      json.forEach((val, index) => {  
        const __template = document.createElement('tr')
        __template .id = `suppliers-list-${val.id}`
        __template.innerHTML = `
          <td>
            <a href="#/suppliers/${val.id}/info">${val.id}</a>
            ${val.logo[val.logo.length-1]!='/' ? `<img src="${val.logo}" onerror="this.src='assets/img/company_logo.png'" width="50%" style="max-width: 150px;" class="p-2"/>` : '<img src="assets/img/company_logo.png" width="90px" class="p-2"/>'}<br/>
          </td>
          <td style="max-width:200px">
                  <a href="#/suppliers/${val.id}/info">${val.name}</a>
          <td>${val.alias}</td>
          <td>${val.industry || 'N/A'}</td>
          <td>${val.status == 0 ? 'Active' : '' }</td>
          <td>${val.date_created || 'N/A'}</td>
          <td width="110px">
            <button class="btn btn-light btn-sm"><i class="material-icons text-danger md-18 remove-comp-modal-btn" data-target="#general-modal" data-popup-toggle="open" data-resource="${val.id}">remove_circle</i></button>
            <a class="btn btn-light btn-sm"  href="#/suppliers/${val.id}/update"><i class="material-icons  md-18">edit</i></a>
          </td>`
        
        __target.append(__template)
        resolve(json)
      })
    })
  }

  __bindRemove () {
    import('./actions/remove').then(loader => {
      return new loader.default({
        root: this.template,
        selector: '.remove-comp-modal-btn',
        id: this.__opt.id,
      })
    })
  }

  __searchSuccess (json) {
    let __searchSec= this.template.querySelector('#supplier-search-section')
    __searchSec.innerHTML = this.__generateTableHeader()
    // append to DOM
    this.__generateTableListData( json, '#supplier-search-section > .suppliers-table > tbody').then(json => {
      this.__bindRemove ()
      this.__loadPopup ()
    })
  }
  
  __searchEmpty (param) {
    this.template.querySelector('#supplier-search-section').innerHTML = `<small class="text-muted col-12 text-center mb-5 mt-3">The word you are trying to search "${param}" doesn't match any result. <br/>Please try again using another keyword</small>`
  }

  __search (page, param) {
    suppServ.then(res => {
      const __payload = {
        param,
        page: page || 1,
        token: window.localStorage.getItem('token'),
      }
      new res.default().search(__payload).then(res => {
        if(!res.data.length) return this.__searchEmpty(param)
        return this.__searchSuccess (res.data)
      })
    })
  }

  __bindSearch () {
    const __searchField = this.template.querySelector('#search-supplier-input')
    __searchField.addEventListener('keyup', (e) => {
      clearTimeout(this.__timeout)
      this.__timeout = setTimeout(() => {
        if(e.target.value.length < 1) return this.__searchCallPre () 
        // search
        return this.__searchCallBack (e.target.value) 
      }, 600)
    })

  }

  __searchCallPre () {
    let __searchField = this.template.querySelector('#supplier-search-section')
    this.template.querySelector('#list-of-suppliers-stats-section').classList.remove('hide')
    this.template.querySelector('#list-table-container').classList.remove('hide')
    __searchField.classList.add('hide')
  }

  __searchCallBack(param) {
    let __searchField = this.template.querySelector('#supplier-search-section')
    this.template.querySelector('#list-of-suppliers-stats-section').classList.add('hide')
    this.template.querySelector('#list-table-container').classList.add('hide')
    __searchField.classList.remove('hide')
    // search
    this.__search (1, param)
  }

  async __getList () {
    const ApiConfig = await import ('../../config/api').default
    return new Promise ((resolve, reject) => {
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
            __template .id = `suppliers-list-${val.id}`
            __template.innerHTML = `
              <td>
                <a href="#/suppliers/${val.id}/info">${val.id}</a>
                ${val.logo[val.logo.length-1]!='/' ? `<img src="${val.logo}" onerror="this.src='assets/img/company_logo.png'" width="50%" style="max-width: 150px;" class="p-2"/>` : '<img src="assets/img/company_logo.png" width="90px" class="p-2"/>'}<br/>
              </td>
              <td style="max-width:200px">
                      <a href="#/suppliers/${val.id}/info">${val.name}</a>
              <td>${val.alias}</td>
              <td>${val.industry || 'N/A'}</td>
              <td>${val.status == 0 ? 'Active' : '' }</td>
              <td>${val.date_created || 'N/A'}</td>
              <td width="110px">
                <button class="btn btn-light btn-sm"><i class="material-icons text-danger md-18 remove-comp-modal-btn" data-target="#general-modal" data-popup-toggle="open" data-resource="${val.id}">remove_circle</i></button>
                <a class="btn btn-light btn-sm"  href="#/suppliers/${val.id}/update"><i class="material-icons  md-18">edit</i></a>
              </td>`
            
            __target.append(__template)
            this.template.querySelector('#total-current-showing-section').innerHTML = parseInt(this.template.querySelector('#total-current-showing-section').innerHTML) + 1
            resolve(json)
          })
        })
      }
    )})
  }

  async __bindListeners() {
    this.__bindSearch ()
    this.__getList().then((res) => {
      this.__loadPopup()
      this.__bindRemove ()
    })
  }

  __showPager (totalPage, startPage, endPage, activePageIndex) {
    this.__pageNav = document.createElement('ul')
    this.__pageNav.classList.add('small', 'nav')


    this.__pageNavFirst = document.createElement('li')
    this.__pageNavFirst.classList.add('nav-item')
    this.__pageNavFirst.innerHTML = `<a class="nav-link active" href="#/suppliers/all/page/1">&laquo;</a>`

    this.__pageNav.append(this.__pageNavFirst)

    for (let x = startPage; x <= endPage; x++) {
      let pageItem = document.createElement('li')
      pageItem.classList.add('nav-item')
      pageItem.innerHTML = `<a class="nav-link ${activePageIndex == x ? 'active' :''}" href="#/suppliers/all/page/${x}">${x}</a>`

      this.__pageNav.append(pageItem)

    }
    this.__pageNavFirst = document.createElement('li')
    this.__pageNavFirst.classList.add('nav-item')
    this.__pageNavFirst.innerHTML = `<a class="nav-link active" href="#/suppliers/all/page/${totalPage}">&raquo;</a>`

    this.__pageNav.append(this.__pageNavFirst)

    return this.__pageNav
  } 

  __pager (totalPage = 1 ) {
    let el = this.template.querySelector('#suppliers-list-page-nav-section')
    return (el.innerHTML = '') | (el.append(this.__showPager(totalPage < 1 ? 1 : totalPage, 1, totalPage < 1 ? 1 : totalPage , this.__opt.page || 1)))
  }

  async __getStat () {
    
    suppServ.then(res => {
      return new res.default().stat().then(data => {

        return new Promise((resolve, reject) => {
          let __total = 0
          data.forEach((val, index) => {
            __total+= parseInt(val.total)
            if (val.status == 0) this.template.querySelector('#total-all-section').textContent = val.total
            if (val.status == 2) this.template.querySelector('#total-blocked-section').textContent = val.total
            resolve(__total)
          })
        }).then((total) => {
            let totalPage = total/50;
            this.template.querySelector('#total-showing-section').innerHTML = total
            this.__pager(totalPage)
        })
        
      })
    })
  }

  __showStats () {
    this.__statSec = document.createElement('section')
    this.__statSec.classList.add('row')
    this.__statSec.id = 'list-of-suppliers-stats-section'
    this.__statSec.innerHTML = `<div class="col-3">
      <div class="media">
        <div class="status-box text-center m-2">
          <p class="mt-3" id="total-all-section">0</p>
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
          <p class="mt-3" id="total-blocked-section">0</p>
        </div>
        <div class="media-body">
          <h5 class="mt-1 mb-0">Blocked</h5>
          <small>Number of blocked suppliers</small>
        </div>
      </div>
    </div>`

    this.template.querySelector('#list-of-suppliers-stats-section').replaceWith(this.__statSec)
    this.__getStat()
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
        <section class="row hide" id="supplier-search-section"></section>

        <section class="col-12" id="list-table-container"><br/><br/>
          <small><p>Showing <span id="total-current-showing-section">0</span> out of <span id="total-showing-section">0</span></p></small>
          <table class="table suppliers-table">
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

          <section class="d-flex flex-row-reverse">
            <div id="suppliers-list-page-nav-section"></div> 
            <div class="m-2 text-muted small">Page</div>
          </section>
        </section>

      </article>`
    this.__showStats()
    this.__bindListeners()
    return this.template
  }
}


export { template }