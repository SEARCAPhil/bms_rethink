

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

/*Privilege*/
window.bms.default.isCBAAsst = () => {
	return window.localStorage.getItem('role') === 'cba_assistant'
}

window.bms.default.isAdmin = () => {
	return window.localStorage.getItem('role') === 'admin'
}

window.bms.default.isGSU = () => {
	return window.localStorage.getItem('role') === 'gsu'
}

window.bms.default.isSupplier = () => {
	return window.localStorage.getItem('role') === 'supplier'
}

window.bms.default.isStandard = () => {
	return window.localStorage.getItem('role') === 'standard'
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

window.bms.default.activeMenu=(id)=>{
	document.querySelectorAll('.main-menu-list-item').forEach((el,index)=>{
		if(el.getAttribute('id')==id){
			el.classList.add('active')
		}else{
			el.classList.remove('active')
		}
	})
}

const showStandardMenu = () => {
	document.querySelectorAll('.inv-menu-list').forEach((el, index) => {
		el.classList.remove('hide')
	})
}

const showExtendedMenu = () => {
	document.querySelectorAll('.bids-menu-list').forEach((el, index) => {
		el.classList.remove('hide')
	})

	document.querySelectorAll('.bids-menu-list').forEach((el, index) => {
		el.classList.remove('hide')
	})

	document.querySelectorAll('.inv-menu-list').forEach((el, index) => {
		el.remove()
	})
}

const loadCommonSettings = () => {
	// save to global
	window.bms.account = {
		name:  window.localStorage.getItem('givenName'),
		alias: window.localStorage.getItem('givenName').substr(0,2).toUpperCase(),
		department: window.localStorage.getItem('department'),
	}

	setTimeout(() => {

		document.getElementById('givenName-header-section').innerHTML = window.localStorage.getItem('givenName')
		document.getElementById('image-header-section').innerText = window.localStorage.getItem('givenName').substr(0,2).toUpperCase()

		window.bms.default.dropdown('device-dropdown')	

		// show menu per role
		if (window.bms.default.isGSU() || window.bms.default.isCBAAsst() || window.bms.default.isStandard() ) {
			showExtendedMenu()
			
		} else {
			showStandardMenu()
		}

	},1000)

}


const appRoute=new window.bms.exports.Router('http://localhost/bms_rethink/www/',true)
const sideBar=new window.bms.exports.Sidebar('.docker-menu ','#docker-sidebar')

sideBar.toggle()


//main entry point
appRoute.on({
	'': () =>{
		// redirect to home 
		// THIS IS TEMPORARY AND FOR DEMONSTRATION PURPOSES ONLY
		window.location.hash = '/home'
	},
	'/home':(e)=>{ 
		window.bms.default.activeMenu('home_menu')
		loadHome().then(()=>{
			loadCommonSettings()
			hideInit()
			changeDisplay(['div[name="/suppliers"]','div[name="/suppliers/profile"]','div[name="/suppliers/forms/registration"]','div[name="/suppliers/forms/registration/update"]','.nav-top-menu'],'none')
			changeDisplay(['div[name="/home"]'],'block')
			document.querySelector('.suppliers-router-section').classList.remove('hide')
		})

		if (!window.localStorage.getItem('role')) {
			window.location.hash = '#/logout'
		}
	},
	'/suppliers/*':()=>{
		window.bms.default.activeMenu('suppliers_main_menu')
		hideInit()
		loadCommonSettings()
		//changeDisplay(['.nav-top-menu'],'block')
		document.querySelector('.nav-top-menu').classList.remove('hide')
		document.querySelector('.suppliers-router-section').classList.remove('hide')

		changeDisplay(['div[name="/home"]','.bids-router-section'],'none')
		window.bms.default.lazyLoad(['./assets/js_native/assets/js/routers/suppliers/suppliers.js'],{once:true})
		setTimeout(() => {
			window.bms.default.lazyLoad(['./assets/js_native/assets/js/modules/Bidding/Util/AccountSidebar.js'],{once:true})
		},1000)

	},
	'/bids/*':()=>{
		window.bms.default.activeMenu('bids-menu-list')
		hideInit()
		loadCommonSettings()

		changeDisplay(['.suppliers-router-section','.nav-top-menu'],'none')
		document.querySelector('.bids-router-section').classList.remove('hide')
		window.bms.default.lazyLoad(['./assets/js_native/assets/js/routers/bidding/bidding.js'],{once:true})

		setTimeout(() => {
			window.bms.default.lazyLoad(['./assets/js_native/assets/js/modules/Bidding/Util/AccountSidebar.js'],{once:true})
		},1000)
		
	}


	,
	'/inv/*':()=>{
		window.bms.default.activeMenu('inv-menu-list')
		hideInit()
		loadCommonSettings()
		
		changeDisplay(['.suppliers-router-section','.nav-top-menu','.bids-router-section'],'none')
		document.querySelector('.inv-router-section').classList.remove('hide')
		window.bms.default.lazyLoad(['./assets/js_native/assets/js/routers/invitation.js'],{once:true})
		setTimeout(() => {
			window.bms.default.lazyLoad(['./assets/js_native/assets/js/modules/Bidding/Util/AccountSidebar.js'],{once:true})
		},1000)
	},
	'/feedback/form':()=>{
		window.bms.default.activeMenu('feedback-menu-list')
		hideInit()
		loadCommonSettings()
		
		changeDisplay(['.suppliers-router-section','.nav-top-menu','.bids-router-section','.inv-router-section'],'none')
		document.querySelector('.feedback-router-section').classList.remove('hide')
		window.bms.default.lazyLoad(['./assets/js_native/assets/js/routers/feedback/feedback.js'],{once:true})
	},
	'/logout':()=>{
		window.document.body.innerHTML = '<center><br/>loging out . . .</center>'
		window.localStorage.clear()
		window.location = 'pages/'
		
	},

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