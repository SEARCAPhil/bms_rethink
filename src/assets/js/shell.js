const XHR = new window.bms.exports.XHR()
const appRoute=new window.bms.exports.Router('http://localhost/bms_rethink/www/',true)
const sideBar=new window.bms.exports.Sidebar('.docker-menu ','#docker-sidebar')

/**
 * Privilege
 * Identifies privilege based on given role
 */
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

/**
 * Display Settings
 * Show sections based on given privilege
 */
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

window.bms.default.loadCommonSettings = () => {
	// save to global settings
	window.bms.account = {
		name:  window.localStorage.getItem('givenName') || 'Guest Account' ,
		alias: (window.localStorage.getItem('givenName') || '   ').substr(0,2).toUpperCase(),
		department: window.localStorage.getItem('department'),
	}
    // change user info in DOM's header
	setTimeout(() => {
        // show menu per role
		const role = (window.bms.default.isGSU() || window.bms.default.isCBAAsst() || window.bms.default.isStandard() ) ? showExtendedMenu() : showStandardMenu()
        // User's information
		document.getElementById('givenName-header-section').innerHTML = window.localStorage.getItem('givenName')
		document.getElementById('image-header-section').innerText = window.localStorage.getItem('givenName').substr(0,2).toUpperCase()
		window.bms.default.dropdown('device-dropdown')	
	},1000)
}


/**
 * MAIN ENTRY POINT
 * Identifies route based on given URL and Parameters
 * This uses Navigo as its router
 */
appRoute.on({
	'': () =>{
		// redirect to home by default
		window.location.hash = '/home'
	},
	'/home':(e)=>{ 
        window.bms.default.lazyLoad(['./assets/js_native/assets/js/routers/home.js'],{once:true})
	},
	'/bids/*':()=>{
		window.bms.default.lazyLoad(['./assets/js_native/assets/js/routers/bidding.js'],{once:true})
	},
	'/logout':()=>{
		window.document.body.innerHTML = '<center><br/>loging out . . .</center>'
		window.localStorage.clear()
		window.location = 'pages/'
	}
}).resolve()

// show sidebar
sideBar.toggle()
