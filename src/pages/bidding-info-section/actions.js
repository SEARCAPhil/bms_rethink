const BiddingServ = import('../../services/bidding-list-service')
const ListItem = import('../../components/list-item')
const ListSection = import('../../components/list-section')
const DropdownLoader = import('../../utils/dropdown-loader/index')
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
      newLSec.classList.add('list-bids-container', 'd-none', 'd-lg-block')
      newLSec.style.zIndex = 1
      newLSec.innerHTML = sec.default
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
const getBiddingList = (opt = {}) => { 
  // load Via AJAX
  const listSection = document.querySelector('.list-bidding-section')
    BiddingServ.then(loader => { 
      const a = new loader.default()
      a.lists({ token : window.localStorage.getItem('token'), filter: opt.filter || 'all' }).then(res => {

        // clear section for page 1
        if(opt.page < 2) listSection.innerHTML = ''

        // items
        ListItem.then(item => {
          // items
          res.forEach((el, index) => {
            const lItem = new item.default({class: 'col-12 list', id: el.id, profile_name: el.profile_name, date_created: el.date_created})
            listSection.append(lItem)
          })

        })
      })
    })
}

export { loadListSection, getBiddingList }