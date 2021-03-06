
	//sideBar
	let sideBar=false

	//list of scripts loaded by lazyLoader using once option
	window.bms.default.loadedScript=[]

	const sideBarInit=()=>{
		let sideBar=new window.bms.exports.Sidebar('.docker-menu ','#docker-sidebar')
		sideBar.toggle()
	}


	window.bms.default.activateMenu=(name)=>{
		document.querySelectorAll('.main-menu-list-item').forEach((el,index)=>{
			el.classList.remove('active')
			if(el.getAttribute('data-status')==name) el.classList.add('active')
		})
	}

	//parse script and link from DOM
	//since XHR DOESn't execute js
	window.bms.default.scriptLoader=(scope)=>{
		console.log(scope)
		scope.querySelectorAll(`script`).forEach((sc,index)=>{

			let el=document.createElement('script')
			el.src=sc.getAttribute('src')
			if(sc.async) el.setAttribute('async','')
			sc.replaceWith(el)
		})

		scope.querySelectorAll(`link`).forEach((sc,index)=>{
			let el=document.createElement('link')
			el.href=sc.getAttribute('href')
			el.type="text/css"
			el.rel="stylesheet"
			sc.replaceWith(el)
		})
		
	}


	//inject <script> in document.body
	//this is needed if you want to import javscript only after
	//DOM is loaded
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


	// for dropdown
	window.bms.default.dropdown = (className) => {
		window.bms.default.modal = window.bms.default.modal || {}
		const targ = document.querySelectorAll(`.${className}`)
		targ.forEach((el, index) => {
			if(el.classList.contains('data-bind-dropdown')) return 0
			el.addEventListener('click', (e) => {
				e.target.preventDefault()
				// get ID
				window.bms.default.modal.resources =  el.getAttribute('data-resources')
				//close all open dropdpwn
				document.querySelectorAll('.dropdown-section').forEach((el2, index2) => {
					el2.classList.remove('open')
				})

				const targEl = el.getAttribute('data-target')
				// prevent adding new listeners
				el.classList.add('data-bind-dropdown')

				let target = document.getElementById(targEl)
				target.classList.toggle('open','close')

			})
		})
	}



	if(!sideBar) sideBarInit()

		
