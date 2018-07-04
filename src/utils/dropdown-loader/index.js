import style from './style'
/**
 * Enable toggle on given class
 * 
 * @function window.bms.default.dropdown
 * @param {string} className 
 */

export default  (className) => {
  // create style
  if (!document.getElementById('styl')) {
    const styl = document.createElement('style')
    styl.id = 'dropdownStyle'
    styl.innerHTML = style.toString()
    document.body.append(styl)
  }

  const targ = document.querySelectorAll(`.${className}:not(.data-bind-dropdown)`)
  // window
  window.bms = window.bms || {}
  window.bms.default = window.bms.default || {}
  window.bms.default.modal = window.bms.default.modal || {}
  
	// read elements
	targ.forEach((el, index) => {
		// mark as binded
    el.classList.add('data-bind-dropdown')
    
    el.addEventListener('click', (e) => {
      e.preventDefault()
      // target ID
      const targEl = el.getAttribute('data-device-dropdown')

      // get ID
      // Holds the ID to be sent to the server
      window.bms.default.modal.resources =  el.getAttribute('data-resources')
      window.bms.default.modal.element = el
      
      // dropdown section
      let target = document.getElementById(targEl)
      let a = new Promise((resolve, reject) => {
        //close all open dropdpwn
        document.querySelectorAll('.dropdown-section').forEach((el2, index2) => {
          if (el2.classList.contains('open') && el2!=target)  el2.classList.remove('open') 
          resolve()
        })
      }).then(() => {
        target.classList.toggle('open')
        // prevent adding new listeners
        el.classList.add('data-bind-dropdown')
      })
    })
	})
}
