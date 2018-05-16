const XHR = new window.bms.exports.XHR()
const appRoute = new window.bms.exports.Router('http://localhost/bms_rethink/www/',true)

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
			window.bms.default.changeDisplay(['div[name="/home"]'],'block')
            document.querySelector('.welcome-router-section').classList.remove('hide')
            // hide splash screen
            window.bms.default.hideSplash()
		})

		if (!window.localStorage.getItem('role')) {
			window.location.hash = '#/logout'
		}
	}
}).resolve()
