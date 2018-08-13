const Serv = import('../../services/bidding-inv-service')
const ListSection = import('../../components/list-section')
const DropdownLoader = import('../../utils/dropdown-loader')

const loadPopup = () => {

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
 * Load List section
 */
const loadListSection = () => { 
  return new Promise((resolve, reject) => {
    ListSection.then(sec => {
      const lSec = document.querySelector('list-section') || document.querySelector('.list-bids-container')
      if (!lSec) return 0
      // list section
      const newLSec = document.createElement('article')
      newLSec.classList.add('list-bids-container', 'd-none', 'd-lg-block', 'col-lg-2')
      newLSec.style.zIndex = 1
      newLSec.innerHTML = sec.default
      newLSec.querySelector('.suppliers_new_button').parentNode.remove()
      lSec.replaceWith(newLSec)
      
      // dropdown
      DropdownLoader.then(loader =>  loader.default('device-dropdown'))
      // resolve
      resolve()
    })
  }).catch(err => {
    reject(err)
  })
}

/**
 * Bidding List AJAX
 */
const list = (opt = {}) => { 
  opt.page = opt.page || 1
  // load Via AJAX
  const listSection = document.querySelector('.list-bidding-section')
  Serv.then(loader => { 
    new loader.default().list({ token : window.localStorage.getItem('token'), filter: opt.filter || 'all', page: opt.page }).then(res => {

      // clear section for page 1
      if(opt.page < 2) listSection.innerHTML = ''

      // items
      import('../../components/inv-item').then(item => {
        // items
        res.forEach((el, index) => {
          const lItem = new item.default({class: 'col-12 list', id: el.id, name: el.name, quantity: el.quantity, unit: el.unit, bidding_requirements_id: el.bidding_requirements_id, deadline: el.deadline})
          listSection.append(lItem)
        })

         // more btn
         setTimeout(() => {
          const moreBtn = document.createElement('a')
          moreBtn.href = '#'
          moreBtn.textContent = 'More'
          moreBtn.classList.add('col-12')
          moreBtn.style.textAlign = 'center'
          moreBtn.style.paddingBottom = '100px'
          moreBtn.style.paddingTop = '10px'
          moreBtn.opt = {}
          moreBtn.opt.filter = opt.filter
          moreBtn.opt.page = opt.page+1
          moreBtn.addEventListener('click', (e) => {
           e.preventDefault()
           list(e.target.opt)
           moreBtn.remove()
          })

          return  res.length > 0 ? listSection.append(moreBtn) : 0
          
        }, 1000)
      })
    })
  })
}


  /**
   * Attachment Components
   */
  const loadAttachments = (target, data) => {
      
    import('../../components/attachments-item').then(res => {
      const targ = document.querySelector(target)
      if (!targ) return 0
      // empty section
      targ.innerHTML = ''
      // append files
      data.forEach((val ,index) => {
        if(!val.locked) val.menus = ['remove']
        targ.append(new res.default(val))
      })
      setTimeout(() => {
        // dropdown
        DropdownLoader.then(loader =>  loader.default('device-dropdown'))
        loadPopup()
      },2000)
    })
  }

export { loadListSection, list, loadAttachments }