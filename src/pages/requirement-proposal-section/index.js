const infoMenu = import('../../components/requirement-menu')
const info = import('../../services/bidding-req-proposal-service')
const infoStatus = import('../../components/bidding-status')
const statusMessage = import('../../components/requirement-status')

export default class {
  constructor (opt) {
    this.opt = opt
    this.__info = {}
    return this.render()
  }
  
    /**
   * Get bidding information via built-in bidding services
   * 
   * @param {int} id 
   */
  __getInfo (id) {
    // fetch details
    return new Promise((resolve, reject) => {
      import('../../services/bidding-req-service').then(loader => {
        const a = new loader.default().view({ id, token: localStorage.getItem('token') }).then(res => {
          resolve(res[0])
        }).catch(err => reject(err))
      })
    })
  }

  /**
   * Assign information to scoped data
   */
  async getInfo() {
    if(!this.__info.id) {
      await this.__getInfo(this.opt.id).then(data => {
        this.__info = data
      })
    }
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

  __getList () {
    info.then(loader => {
      new loader.default().lists({
        id: this.opt.id,
        token: window.localStorage.getItem('token'),
        filter: 'all',
        page: 1,
      }).then(res => {
        this.showProposals('.proposal-list-section > ul' , res)
      })
    })
  }

  __bindListeners () {
    import('./actions/create').then(loader => {
      return new loader.default({
        id: this.opt.id,
        token: window.localStorage.getItem('token'),
        selector: '.proposal-reg-dialog-btn',
      })
    })

  }

  showProposals (target, data, isEmpty = false) { 
    let __targ = this.template.querySelectorAll(target)

    // clear proposal list section
    if(isEmpty) __targ.forEach((el, index) => { el.innerHTML ='' })


    data.forEach((val, index) => {
      let html = document.createElement('li')
      let status = ''
      html.classList.add('nav-item', 'col-12')
      html.setAttribute('data-resources', val.id)
      html.style = 'border-bottom:1px solid #ccc;padding-top:15px;padding-bottom: 5px;'
      html.id = val.id

      
      if (val.status == 0) {
        status = `<br/><span class="text-danger" data-resources="${val.id}"><i class="material-icons md-12">drafts</i> DRAFT</span>`
      }

      if (val.status == 1 || val.status == 5) {
        status = `<br/><span class="text-success" data-resources="${val.id}"><i class="material-icons md-12">check</i> Sent</span>`
      }


      if (val.status == 2) {
        status = `<br/><span class="text-danger" data-resources="${val.id}"><i class="material-icons md-12">warning</i> Requesting changes</span>`
      }

      if (val.status ==3) {
        status = `<br/><span data-resources="${val.id}" style="color:#ffb80c;"><i class="material-icons">star</i> AWARDED</span>`
        // show won status
       //// showWon()
        // add medal icon
        //const img = document.createElement('img')
        //img.src = 'assets/img/trophy.png'
        //img.style.width = '30px'
        //document.querySelector('.req-name').append(img)
      }

      html.innerHTML = `
        <a href="#" class="proposal-dialog-btn row" data-resources="${val.id}">
            <div class="col-3"  data-resources="${val.id}">
                <div class="text-center" data-resources="${val.id}" style="float:left;width:35px;height:35px;border-radius:50%;margin-right:10px;overflow:hidden;background:#42403c;color:#fff;padding-top:5px" id="image-header-section"  data-resources="${val.id}">${val.username.substr(0,2).toUpperCase()}</div>
            </div>
            <div class="col-7"  data-resources="${val.id}">
              <section data-resources="${val.id}">
                <small>
                  <p data-resources="${val.id}">
                    ${val.username}<br/>
                    <span class="text-muted">${val.date_created}</span>
                    ${status}
                  </p>
                </small>
              </section>
            </div>
        </a>`
        
      // insert to DOM
      __targ.forEach((el, index) => {
        el.append(html)
      })
    })

    setTimeout(() => {
      import('./actions/view').then(loader => {
        return new loader.default({
          id: this.opt.id,
          token: window.localStorage.getItem('token'),
          selector: '.proposal-dialog-btn',
        })
      })
    }, 1000)

  }

  /**
   * Return template as HTMLObject to be rendered in DOM
   */
  async render () {

    this.__info = await this.__getInfo(this.opt.id)
    const template = document.createElement('section')

    template.classList.add('col-lg-3')
    template.id = 'requirement-proposal-container'
    template.innerHTML = `
    <section>
      <style>#requirement-proposal-container { background: #eee!important; padding-top: 100px; padding-bottom: 100px; height: 100vh; overflow-x:hidden; overflow-y:auto; border-left: 1px solid #ccc; }</style>
      <h5>Proposals</h5><hr/>
      <div class="col-12">
        <center>
          <p class="text-muted">
            <i class="material-icons md-48">insert_drive_file</i><br>
            Submit a good propasal and stand above all other companies!<br><br>
            <a href="#" class="proposal-reg-dialog-btn" onclick="event.preventDefault();">Submit <i class="material-icons md-18">add_circle</i></a></p>
        </center>
        <hr/>
      </div>
      <section id="proposal-list-section" class="proposal-list-section">
        <menu class="row col-12">
          <div class="col-2">
            <input type="checkbox" name="compare" id="compare-checkbox">
          </div>
          <div class="col-8">
            <button class="btn btn-default btn-sm event-binded" type="button" id="compare-btn">Compare</button>
          </div>
        </menu>
        
        <menu class="row col-12">
          <div class="col-2">
            <input type="checkbox" name="compare-sign" id="compare-sign-checkbox" checked="checked">
          </div>
          <div class="col-8">
            <small class="text-muted">Include signatories?</small>
          </div>
        </menu><hr>
        
        <ul class="nav"></ul>
      </section>
    </section>`
    this.template = template
    this.__getList()
    this.__bindListeners()
    return template
  }

}
