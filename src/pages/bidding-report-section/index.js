import style from './style'
import styleRatings from '../../components/general-style/star-ratings'
import Network from '../../config/api'

const infoMenu = import('../../components/bidding-info-menu')
const infoStatus = import('../../components/bidding-status')
const info = import('../../services/bidding-list-service')
const statusMessage = import('../../components/status-message')

class template {
  constructor (params) {
    this.__params = params
    this.__info = {}
   
  }

  __bindListeners () {
    import('./actions/summary')
    // load popup
    const popupes = import('../../components/popup-es')
    const popupesStyle = import('../../components/popup-es/style')
    popupesStyle.then(css => {
      const style = document.createElement('style')
      style.id = 'popup-es-style'
      style.innerHTML = css.default.toString()
      if(!document.querySelector('#popup-es-style')) document.head.append(style)
      
    })
    popupes.then(loader => { 
     const a = new loader.default()
    })

    // load dropdown
    import('../../utils/dropdown-loader').then(loader => new loader.default('device-dropdown'))
  }

  /**
   * Return template as HTMLObject to be rendered in DOM
   */
  async render () {

    this.template = document.createElement('section')

    // template settings
    this.template.setAttribute('style', 'margin-top:50px;padding-bottom:40px;height:100vh;overflow-y:auto;')
    this.template.classList.add('col-lg-12')
    this.template.id = 'bids-report-section'
    this.template.innerHTML = `
      <style>${style.toString()} ${styleRatings.toString()}</style>
      <article class="col-md-12 col-lg-10 offset-lg-1 row" style="padding-bottom: 100px;">
        <section class="col-lg-6" style="margin-top: 90px;">
            <div id="container" style="width:100%; height:400px;"></div>
            <section class=" d-flex align-items-stretch">
                <div class="col-2"><b>Results</b></div>
                <div class="col-10">
                    <div class="col-12" id="analysis-section"></div>
                    <div class="col-12">
                        <span  style="position:relative;">
                            <button class="btn btn-sm btn-dark device-dropdown" data-device-dropdown="dropdown-export">Export</button>
                            <div class="dropdown-section float-right" id="dropdown-export">
                                    <ul class="list-group list-group-flush">
                                        <li class="list-group-item">
                                            <a href="#" onclick="event.preventDefault();" id="print-pdf-href">
                                                PDF
                                            </a>
                                        </li>
                                    <ul>
                            </div>
                        </span>
                        &emsp;
                        <a href="#" onclick="event.preventDefault();" class="text-success change-date-modal-btn" data-target="#general-modal" data-popup-toggle="open">Change</a>&nbsp;
                        <b id="from-section">10/2018</b> - <b id="to-section">10/2018</b>
                    </div>
                    <div class="col-12"><br/>
                        <p class="text-danger">
                            <span id="total-count-section">0</span> Total number of bidding requests
                        </p>

                        <p>
                            <span style="color:#F2994A;" id="normal-count-section">0</span> Normal
                        </p>
                        <p>
                            <span style="color:#F2994A;" id="exempted-count-section">0</span> Exempted
                        </p>
                    </div>
                </div>
            </section>

        </section>

        <section class="col-lg-6"  style="margin-top: 90px;padding-bottom: 100px;">
            <h5><b>Utilization per Unit / Department</b></h5>
            <hr/>

            <div class="media">
                <i class="material-icons md-48 mr-4">trending_up</i>
                <div class="media-body">
                  <h5 class="mt-0">Engagement</h5>
                  <span class="text-muted">This shows the actual number of bidding requests created by each department. By simply looking on this table,
                  you can analyze their engagement in bidding process</span>
                </div>
              </div><br/><br/>

              <section id="utilization-per-department-section">

              </section>

        </section>
    </article>
      `
    this.__bindListeners()
    return this.template
  }

}


export { template }