/**
 * Read EXTERNAL script and link from GIVEN NODE and append to the header.
 * This is used for parsing script from XHR response
 * 
 * @function window.bms.default.scriptLoader
 * @param {string} scope - HTML Node
 * @example
 * // window.bms.default.scriptLoader(document)
 */
export default (scope) => {
	scope.querySelectorAll(`script`).forEach((sc,index)=>{
		// external JS
		if(sc.getAttribute('src')) {
			let el=document.createElement('script')
			el.src=sc.getAttribute('src')
			if(sc.async) el.setAttribute('async','')
			sc.replaceWith(el)	
		} else {
			// internal script
			let el=document.createElement('script')
  			let textNode = document.createTextNode(sc.innerHTML); 
			el.appendChild(textNode)
			if(!sc.async) el.setAttribute('async',false)
			const head = document.getElementsByTagName("head")[0];
			head.appendChild(el)
		}
	})
	// external CSS
	scope.querySelectorAll(`link`).forEach((sc,index)=>{
		let el = document.createElement('link')
		el.href = sc.getAttribute('href')
		el.type = "text/css"
		el.rel = "stylesheet"
		sc.replaceWith(el)
	})	
}