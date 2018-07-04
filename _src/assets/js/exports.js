import Router from 'Navigo'
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




