import ApiConfig from '../../config/api'

const fileIconCss = import('../../assets/css/fileicon.css')

export default class {
  constructor(opt = {}) {
    return this.render(opt) 
  }

  bindListeners (opt) {
    import('../popup-es').then(loader => new loader.default())
  }

  render(opt = {}) { 
    opt.menus = opt.menus || []
    this.template = document.createElement('section')
    this.template.classList.add('col-lg-4', 'col-md-4')
    this.template.id = `requirement-recepient-item-${opt.id}`

    // custom classes
    if(opt.class) this.template.classList.add(...opt.class.split(' '))
    
    
    // template
    this.template.innerHTML = `

          <div class="d-flex align-items-stretch" style="padding:5px;background:#393f45;border:1px solid #fefefe;color:#fff;" id="requirements-recepients-list-${opt.id}">
            <div class="col-9">
              <div style="float:left;width:100%;max-height:30px;overflow:hidden;text-overflow:ellipsis;">${opt.name}</div>
            </div>

            <div class="col-1">
              <i class="material-icons md-18 device-dropdown" data-device-dropdown="dropdown-req-recepients-${opt.id}" data-resources="${opt.id}">arrow_drop_down</i>
              <div class="dropdown-section float-right" id="dropdown-req-recepients-${opt.id}">
                <ul class="list-group list-group-flush" style="font-size:14px;">
                  <!--<li class="list-group-item"><a data-target="#bidding-modal" data-popup-toggle="open" href="#" class="remove-receipients-modal" data-resources="${opt.id}">Cancel Invitation</a></li>-->
                  <li class="list-group-item"><a href="${ApiConfig.url}/bidding/reports/price_inquiry_per_item.php?id=${opt.id}&token=${window.localStorage.getItem('token')}" target="_blank" data-resources="${opt.id}"><div class="file-icon file-icon-sm" data-type="pdf"></div> Price Inquiry</a></li>
                  <li class="list-group-item"><a href="${ApiConfig.url}/bidding/reports/price_inquiry.php?id=${opt.id}&token=${window.localStorage.getItem('token')}" target="_blank" data-resources="${opt.id}"><div class="file-icon file-icon-sm" data-type="pdf"></div> See Related</a></li>
                <ul>
              </div>
            </div>
          </div>

      `
    this.bindListeners(opt)
    // start rendering
    return this.template
  }
}
