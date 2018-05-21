/**
 * EXPORTS.JS
 * 
 * Load common JS and configuration
 * This must be loaded before any other script
 */
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
window.bms.default.loadedScript=[]
window.bms.default.lazyLoad=(src=[],opts={})=>{
	return new Promise((resolve,reject)=>{
		//options
		let opt=opts
		opt.async=opts.async||false
		opt.once=opts.once||false


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


//parse script and link from DOM
//since XHR DOESn't execute js
window.bms.default.scriptLoader=(scope)=>{
	
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

	scope.querySelectorAll(`link`).forEach((sc,index)=>{
		let el=document.createElement('link')
		el.href=sc.getAttribute('href')
		el.type="text/css"
		el.rel="stylesheet"
		sc.replaceWith(el)
	})
	
}

// dynamic loading of CSS
window.bms.default.loadCSS = (href) => {
	let css = document.createElement('link')
	css.type= 'text/css'
	css.rel = 'stylesheet'
	css.href = href
	document.body.append(css)
}


// for dropdown
window.bms.default.dropdown = (className) => {
	window.bms.default.modal = window.bms.default.modal || {}
	const targ = document.querySelectorAll(`.${className}:not(.data-bind-dropdown)`)
	console.log(targ)
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


window.bms.default.activeMenu=(id)=>{
	document.querySelectorAll('.main-menu-list-item').forEach((el,index)=>{
		if(el.getAttribute('id')==id){
			el.classList.add('active')
		}else{
			el.classList.remove('active')
		}
	})
}


// splash screen
window.bms.default.hideSplash = () => {
	document.querySelector('splash-page').style.display = 'none'
}

// loading
window.bms.default.spinner = new window.bms.exports.Spinner({
	target:'body',
	class:'spinner'
})


window.bms.default.toggleOpenClasses=(selector=[],display="block")=>{
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


window.bms.default.showAllMenuForOpen = (action = 0) => {
	if (action) {
		document.querySelectorAll('.for-open').forEach((el, index) => {
			el.classList.remove('for-open')
		}) 
	}
}




