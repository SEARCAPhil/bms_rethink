
import uaParser from 'ua-parser-js'

const suppServ = import('../../services/supplier-account-service')


export default class {
  constructor (params) {
    this.__opt = params
    this.parser  = new uaParser();
    return this.render ()
  }

  __get () {
    return new Promise ((resolve, reject) => {
      suppServ.then(res => {
        const __payload = {
          id: this.__opt.id,
          page: this.__opt.page || 1,
          token: window.localStorage.getItem('token'),
        }

        new res.default().activities(__payload).then(d => {
          resolve(d.data)
        }).catch(e => reject(e))

      })
    })
  }

  __generate(data) {
    let __data = ''
    return new Promise((resolve, reject) => {
      data.forEach((val, index) => {
        __data+=`<section class="sections-list-item pb-3 row">
          <div class="col-3 pt-3">
            <small>
                <span class="text-muted">${val.date_created}</span><br/>
              <span class="text-info">Reference #${val.id}</span>
            </small>
          </div>
          <div class="col-9 pt-3"><small>${val.message}</small></div>
        </section>`

        
      })
      resolve(__data)
    })
  }


  loadMore (e) { 
    e.target.remove()
    this.__opt.page = this.__opt.page ? (this.__opt.page+1) : 2
    this.load ()
  }

  showMoreBtn () {

    const btn = document.createElement('btn')
    const __proto__ = Object.assign({__proto__: this.__proto__}, this)

    btn.classList.add('btn', 'btn-light','mt-3')
    btn.innerText = 'Load More'
    btn.addEventListener('click', this.loadMore.bind(__proto__))
    return btn
  }

  load () {
    const __targ = this.template.querySelector('#activity-list-section')
    this.__get().then(data => { 
      this.__generate(data).then(html => (__targ.innerHTML += html) | (data.length ? __targ.append(this.showMoreBtn()) : ''))
      //this.__generateSessionsData(ses).then(html => (__targ.innerHTML += html) | (ses.length ? __targ.append(this.showMoreSessionsBtn()) : ''))
    })
  }


  __bindListeners() {
    this.load ()
  }

  /**
   * Return template as HTMLObject to be rendered in DOM
   */
  async render () {
    this.template = document.createElement('article')

    this.template.innerHTML = `
      <section class="row">
        <div class="col-1">
          <i class="material-icons md-48" style="color:#03A9F4;">laptop</i>
        </div>
        <div class="col-11 pt-3"><span class="text-muted">Activities</span></div>
    </section>
    <hr/>
    <section id="activity-list-section"></section>`

    this.__bindListeners()
    return this.template
  }

  
}
