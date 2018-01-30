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


window.bms.default.changeDisplay=(selector=[],display="block")=>{
	selector.forEach((val,index)=>{

		var el=document.querySelector(val)
		if(el){
			console.log(el)
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


var changeDisplay=window.bms.default.changeDisplay

const hideInit=()=>{
	document.querySelector('initial-page').style.display='none'
}

const XHR=new window.bms.exports.XHR()

const loadHome=()=>{
	return new Promise((resolve,reject)=>{
		XHR.request({url:'./pages/welcome.html',method:'GET'}).then((data)=>{
			var el=document.querySelector('div[name="/home"]')
			el.style.display="block"
			el.innerHTML=data
			resolve(data)
		})
	}) 
	
}

const activeMenu=(id)=>{
	document.querySelectorAll('.main-menu-list-item').forEach((el,index)=>{
		if(el.getAttribute('id')==id){
			el.classList.add('active')
		}else{
			el.classList.remove('active')
		}
	})
}


const appRoute=new window.bms.exports.Router('http://localhost/bms_rethink/www/',true)
const sideBar=new window.bms.exports.Sidebar('.docker-menu ','#docker-sidebar')

sideBar.toggle()

appRoute.on({
'/home':(e)=>{ 
	activeMenu('home_menu')
	loadHome().then(()=>{
		hideInit()
		changeDisplay(['div[name="/suppliers"]','div[name="/suppliers/profile"]','div[name="/suppliers/forms/registration"]','div[name="/suppliers/forms/registration/update"]','.nav-top-menu'],'none')
		changeDisplay(['div[name="/home"]'],'block')
	})
},
'/suppliers/*':()=>{
	activeMenu('suppliers_main_menu')
	hideInit()
	//changeDisplay(['.nav-top-menu'],'block')
	document.querySelector('.nav-top-menu').classList.remove('hide')



	
	changeDisplay(['div[name="/home"]'],'none')
	window.bms.default.lazyLoad(['./assets/js_native/assets/js/routers/suppliers/suppliers.js'],{once:true})

}

}).resolve()

var initH=(window.innerHeight)

const changeHeight=(selector)=>{
	document.querySelectorAll(selector).forEach((el,index)=>{
		el.style.minHeight=`${window.innerHeight}px`
		el.style.maxHeight=`${window.innerHeight}px`
		el.style.overflowY='hidden'
		el.style.overflow="auto"
	})
}

changeHeight('.max-height-panel')

/*navigator.serviceWorker.register('../sw.js').then(reg=>{
var newWorker = reg.installing;

if(newWorker){
	// statechange fires every time the ServiceWorker.state changes
    newWorker.onstatechange = function() { 
    	 if (newWorker.state == 'activated') {
    		 window.bms.default.availableOffline()
    	}
    }
}


}).catch(err=>{
console.log(err)
})*/


window.addEventListener('resize',e=>{
	let xs = window.getComputedStyle(document.querySelector('.hidden-on-xs')).display
	let sm = window.getComputedStyle(document.querySelector('.hidden-on-sm')).display
	let md = window.getComputedStyle(document.querySelector('.hidden-on-md')).display
	let lg = window.getComputedStyle(document.querySelector('.hidden-on-lg')).display

	

	if(lg=='none'){
		let profSection = document.querySelector('div[name="/suppliers/profile"]')
		profSection.classList.add('show')
		profSection.classList.remove('hide')

		let listSidebar = document.querySelector('div[name="/suppliers"]')

		listSidebar.classList.remove('hide','show')

		let dockerSidebar = document.querySelector('#docker-sidebar')

		dockerSidebar.classList.remove('hide','show')

	}

	changeHeight('.max-height-panel')

	//suppliers list
	/*let listSidebar = document.querySelector('div[name="/suppliers"]')
	let listSidebarStyle = listSidebar.classList.contains('hide')
	
	if(listSidebarStyle&&lg=='none') listSidebar.classList.replace('hide','show')

	//profile
	let profSection = document.querySelector('div[name="/suppliers/profile"]')

	if(profSection.classList.contains('hide')) profSection.classList.replace('hide','show')*/
	
})