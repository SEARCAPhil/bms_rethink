const XHR = new window.bms.exports.XHR()
const appRoute = new window.bms.exports.Router('http://localhost/bms_rethink/www/',true)

/**
 * Load welcome page
 * 
 * @function loadHome
 * @returns {Promise}
 */
const loadHome = () => {
	return new Promise((resolve,reject)=>{
		XHR.request({url:'./pages/welcome.html',method:'GET'}).then((data)=>{
			var el=document.querySelector('div[name="/home"]')
			el.style.display="block"
			el.innerHTML=data
			resolve(data)
		})
	}) 
}

//main entry point
appRoute.on({
	'': () =>{
	},
	'/home':(e)=>{ 
        window.bms.default.activeMenu('home_menu')
		loadHome().then(()=>{
            // settings
            window.bms.default.loadCommonSettings()
            // show DOM
			window.bms.default.changeDisplay(['div[name="/suppliers"]','div[name="/suppliers/profile"]','div[name="/suppliers/forms/registration"]','div[name="/suppliers/forms/registration/update"]','.nav-top-menu', '.suppliers-router-section'],'none')
			window.bms.default.changeDisplay(['div[name="/home"]', '.welcome-router-section'],'block')
            document.querySelector('.welcome-router-section').classList.remove('hide')
            // hide splash screen
			window.bms.default.hideSplash()
			
			setTimeout(() => {
				window.bms.default.lazyLoad(['./assets/js_native/assets/js/modules/Bidding/Util/AccountSidebar.js'],{once:true})
			},1000)
		})

		if (!window.localStorage.getItem('role')) {
			window.location.hash = '#/logout'
		}
	}
}).resolve()
