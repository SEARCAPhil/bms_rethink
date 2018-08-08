const BiddingServ = import('../../services/bidding-list-service')
const ListItem = import('../../components/list-item')
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
   * Attachment Components
   */
  const loadAttachments = (target, data) => {
      
    import('../../components/requirement-attachments-item').then(res => {
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



    /**
   * Attachment Components
   */
  const loadAwardees = (target, data) => {
      
    import('../../components/requirement-awardees-item').then(res => { 
      const targ = document.querySelector(target)
      if (!targ) return 0
      // empty section
      targ.innerHTML = ''
      // append files
      data.forEach((val ,index) => {
        targ.append(new res.default(val))
      })
      setTimeout(() => {
        // dropdown
        DropdownLoader.then(loader =>  loader.default('device-dropdown'))
        loadPopup()
      },2000)
    })
  }

export { loadAwardees, loadAttachments, loadPopup }