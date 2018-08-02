import Router from 'navigo'
import XHR from './lib/XHR/XHR'
import Sidebar from './components/Sidebar/Sidebar'
import Spinner from './components/Spinner/Spinner'
import PopupES from './components/PopupES/PopupES'
import Config from './config/network/network.config'

window.bms = window.bms || {
	deviceInstance:'mobile',
	suppliers:{ selected: {} },
	bidding:{ selected: {} },
	default:{
		routed:[], // executed routers in window
		state:{
			supplier:{},
			account:{},
			product:{},
			bidding: {
				cur: {
					bid: {},
					particulars: {},
					requirements: {
						criteria : [{
							name: 'price',
							alias: 'Price'
						},{
							name: 'quality',
							alias: 'Goods/ Service Quality'
						},{
							name: 'time',
							alias: 'Delivery Time'
						}],
						criteriaArray: [],
					},
					invitations: {},
				},
			},
			proposals: {
				cur: {},
			}
		},

	},
	config: {
		network: new Config().get(),
	},//global functions
	exports:{
		Router,
		XHR,
		Sidebar,
		Spinner,
		PopupES,
	},
	func:{}
}


//inject <script> in document.body
//this is needed if you want to import javscript only after
//DOM is loaded
window.bms.default.loadedScript = []

/**
 * @function window.bms.default.lazyLoad
 * @param {array} URL
 * @param {Object} opts 
 * @param {boolean} opts.async - Load in async mode
 * @param {boolean} opts.once - Load JS file only once
 */
window.bms.default.lazyLoad = (src = [], opts = {}) => {
	return new Promise((resolve,reject) => {
		//options
		let opt = opts
		opt.async = opts.async || false
		opt.once = opts.once || false

		for(let file of src){
			//stop if already loaded
			if(opt.once&&(window.bms.default.loadedScript.indexOf(file)!=-1)){
				resolve({code:304,message:'route already loaded'})
				return 0
			}else{
				//script
				let sc=document.createElement('script')
				sc.src=file
				//attributes
				if(opt.async) sc.setAttribute('async','')
				//mark as loaded by lazy loader func
				if(opt.module) sc.setAttribute('type','module')
				sc.setAttribute('lazy-loaded','')
				document.body.appendChild(sc)
				//add to list
				window.bms.default.loadedScript.push(file)
				resolve(sc)
			}
		}
	})	
}



/**
 * Read EXTERNAL script and link from GIVEN NODE and append to the header.
 * This is used for parsing script from XHR response
 * 
 * @function window.bms.default.scriptLoader
 * @param {string} scope - HTML Node
 * @example
 * // window.bms.default.scriptLoader(document)
 */
window.bms.default.scriptLoader = (scope) => {
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


/**
 * Load External CSS and automatically appends it to body
 * 
 * @function window.bms.default.loadCSS
 * @param {string} href 
 * @example
 * // window.bms.default.loadCSS('assets/css/sidebar.css')
 */
window.bms.default.loadCSS = (href) => {
	let css = document.createElement('link')
	css.type= 'text/css'
	css.rel = 'stylesheet'
	css.href = href
	document.body.append(css)
}


/**
 * Enable toggle on given class
 * 
 * @function window.bms.default.dropdown
 * @param {string} className 
 */
window.bms.default.dropdown = (className) => {
	const targ = document.querySelectorAll(`.${className}:not(.data-bind-dropdown)`)
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


/**
 * Toggle element by adding .show or .hide to an HTML element
 * 
 * @function window.bms.default.changeDisplay
 * @param {array} selector - className or ID of elements
 * @param {string} [display = block] - block || none
 * @example 
 * //  window.bms.default.changeDisplay(['.sideBar'], 'none')
 */
window.bms.default.changeDisplay = (selector=[], display="block") => {
	selector.forEach((val,index)=>{
		let el = document.querySelector(val)
		if(el){
			if(display=='block'){
				el.classList.add('show')
				el.classList.remove('hide')
			}else{
				el.classList.add('hide')
				el.classList.remove('show')
			}
		} 
	})
}

/**
 * Add active state to sidebar's main navigation
 * 
 * @function window.bms.default.activeMenu
 * @param {string} id - Children of .main-menu-list-item that contains this id
 * @example
 * // window.bms.default.activeMenu('bidding-menu')
 */
window.bms.default.activeMenu = (id) => {
	document.querySelectorAll('.main-menu-list-item').forEach((el,index)=>{
		if(el.getAttribute('id')==id){
			el.classList.add('active')
		}else{
			el.classList.remove('active')
		}
	})
}


/**
 * Hide splash screen
 * 
 * @function window.bms.default.hideSplash
 */
window.bms.default.hideSplash = () => {
	document.querySelector('splash-page').style.display = 'none'
}

// append default loader to the body
window.bms.default.spinner = new window.bms.exports.Spinner({
	target:'body',
	class:'spinner'
})


/**
 * Toggle element by adding or removing .for-open to an HTML element
 * .for-open is initialy added to an element which makes it visible for all users
 * 
 * @function window.bms.default.toggleOpenClasses
 * @param {array} selector - className or ID of elements
 * @param {string} [display = block] - block || none
 * @example 
 * // window.bms.default.toggleOpenClasses(['.sideBar'], 'none')
 */
window.bms.default.toggleOpenClasses = (selector = [], display = "block") => {
	selector.forEach((val,index)=>{

		var el=document.querySelector(val)
		if(el){
			console.log(el)
			if(display=='block'){
				el.classList.remove('for-open')
			}else{
				el.classList.add('for-open')
			}
		} 
	})
}


/**
 * Remove for-open class in an HTMLElement
 * 
 * @function window.bms.default.showAllMenuForOpen
 * @param {number|boolean} [action = false] - true || false
 */
window.bms.default.showAllMenuForOpen = (action = false) => {
	if (action) {
		document.querySelectorAll('.for-open').forEach((el, index) => {
			el.classList.remove('for-open')
		}) 
	}
}




