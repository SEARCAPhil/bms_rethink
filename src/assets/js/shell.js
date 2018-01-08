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


window.bms.default.changeDisplay=(selector=[],display="block")=>{
	selector.forEach((val,index)=>{
		var el=document.querySelector(val)
		if(el) el.style.display=display
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
		changeDisplay(['div[name="/suppliers"]','div[name="/suppliers/profile"]','div[name="/suppliers/forms/registration"]'],'none')
	})
},
'/suppliers/*':()=>{
	activeMenu('suppliers_main_menu')
	hideInit()
	changeDisplay(['div[name="/suppliers"]','div[name="/suppliers/profile"]','div[name="/suppliers/forms/registration"]'],'block')
	changeDisplay(['div[name="/home"]'],'none')
	window.bms.default.lazyLoad(['./assets/js_native/assets/js/routers/suppliers/suppliers.js'],{once:true})

	
},

}).resolve()

var initH=(window.innerHeight)

const changeHeight=(selector)=>{
	document.querySelectorAll(selector).forEach((el,index)=>{
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
