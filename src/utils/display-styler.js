
/**
 * Toggle element by adding .show or .hide to an HTML element
 * 
 * @function window.bms.default.changeDisplay
 * @param {array} selector - className or ID of elements
 * @param {string} [display = block] - block || none
 * @example 
 * //  window.bms.default.changeDisplay(['.sideBar'], 'none')
 */

export default (selector  = [], display="block") => {
	selector.forEach((val,  index)  =>  {
		let el = document.querySelector(val)
		if(el)  {
			if  (display  ==  'block')  {
				el.classList.add('show')
				el.classList.remove('hide')
			} else  {
				el.classList.add('hide')
				el.classList.remove('show')
			}
		} 
	})
}