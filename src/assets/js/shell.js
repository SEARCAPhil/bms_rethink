const XHR = new window.bms.exports.XHR()
const appRoute=new window.bms.exports.Router('http://localhost/bms_rethink/www/',true)
const sideBar=new window.bms.exports.Sidebar('.docker-menu ','#docker-sidebar')

/*------------------------------------------
 * Privilege
 * Identifies privilege based on given role
 *---------------------------------------------*/

/** 
 * @function window.bms.default.isCBAAsst
 * @returns {boolean}  
 * */
window.bms.default.isCBAAsst = () => {
	return window.localStorage.getItem('role') === 'cba_assistant'
}

/**
 * @function window.bms.default.isAdmin
 * @returns {boolean}
 */
window.bms.default.isAdmin = () => {
	return window.localStorage.getItem('role') === 'admin'
}

/**
 * @function window.bms.default.isGSU
 * @returns {boolean}
 */
window.bms.default.isGSU = () => {
	return window.localStorage.getItem('role') === 'gsu'
}

/**
 * @function window.bms.default.isSupplier
 * @returns {boolean}
 */
window.bms.default.isSupplier = () => {
	return window.localStorage.getItem('role') === 'supplier'
}

/**
 * @function window.bms.default.isStandard
 * @returns {boolean}
 */
window.bms.default.isStandard = () => {
	return window.localStorage.getItem('role') === 'standard'
}


/**
 * @function showStandardMenu 
 */
const showStandardMenu = () => {
	document.querySelectorAll('.inv-menu-list').forEach((el, index) => {
		el.classList.remove('hide')
	})
}

/**
 * @function showExtendedMenu 
 */
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


/** 
 * Load account settings in global
 * 
 * @function window.bms.default.loadCommonSettings 
 * @returns {Object} window.bms.account
 */
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


/* MAIN ENTRY POINT
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
   '/bids/requirements/:id': (params) => {
		window.bms.default.lazyLoad(['./assets/js_native/assets/js/routers/bidding/requirements.js'],{once:true})
   	},
   	'/inv/*':()=>{
		window.bms.default.lazyLoad(['./assets/js_native/assets/js/routers/invitation.js'],{once:true})
   	},
	'/logout':()=>{
		window.document.body.innerHTML = '<center><br/>loging out . . .</center>'
		window.localStorage.clear()
		window.location = 'pages/'
	},
	'/feedback/form':()=>{
		window.bms.default.activeMenu('feedback-menu-list')
		window.bms.default.loadCommonSettings()
		window.bms.default.changeDisplay(['.suppliers-router-section','.nav-top-menu','.bids-router-section','.inv-router-section'],'none')
		document.querySelector('.feedback-router-section').classList.remove('hide')
		window.bms.default.lazyLoad(['./assets/js_native/assets/js/routers/feedback/feedback.js'],{once:true})
		// hide splash screen
		window.bms.default.hideSplash()
	},
}).resolve()

// show sidebar
sideBar.toggle()

// Google analytics
setTimeout(() => {
	try {
		if (window.bms.account.name) {
			// delay 3 seconds to avoid blocking
			const r = new Promise((resolve, reject) => {
					const g = document.createElement('script')
					g.setAttribute('async', '')
					g.src = 'https://www.googletagmanager.com/gtag/js?id=UA-99081752-4'
					document.body.append(g)
					resolve()
			}).then(res => {
				window.dataLayer = window.dataLayer || [];
				function gtag(){dataLayer.push(arguments);}
				gtag('js', new Date());
				gtag('set', {'user_id': window.bms.account.name})
				gtag('config', 'UA-99081752-4');
			})	
		}
	} catch (e) {}
},3000)
