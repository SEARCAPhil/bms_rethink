const infoMenu = import('../../components/requirement-menu')
const info = import('../../services/bidding-req-service')
const infoStatus = import('../../components/bidding-status')
const statusMessage = import('../../components/requirement-status')

class template {
  constructor (params) {
    this.__params = params
    this.__info = {}
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


  /**
   * Return template as HTMLObject to be rendered in DOM
   */
  async render () {
    const template = document.createElement('section')
    template.classList.add('col-lg-2')
    template.id = 'requirement-proposal-container'
    template.innerHTML = `
    <section>
      <style>#requirement-proposal-container { background: #eee!important; padding-top: 100px; }</style>
      <h5>Proposals</h5><hr/>

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
    return template
  }

}




export { template }