const appRoute=new window.bms.exports.AppRoute({root:'http://localhost/bms_rethink/www/'})

//load suppliers route and save to window
const loadSuppliersInit=()=>{
	return new Promise((resolve,reject)=>{
		window.bms.default.activateMenu('supplies')

		appRoute.hide(['/home'])
		//route
		appRoute.route('/suppliers',{once:true,window:true}).then(res=>{ 
			window.bms.default.spinner.hide()
			resolve(appRoute)
		}).catch((err)=>{
			if(err.code==304) resolve(appRoute)
		})
	})	
}


 appRoute.Navigo.on({
 	'/*':()=>{
 		//this is required to always treat suppliers as separate route
 		//without this, link will stop working after a few clicks
 	},
	'/suppliers/all':()=>{
		loadSuppliersInit()
	},
	'/suppliers/:id/*':(params)=>{ 
		//load profile routes , about , products , etc 
		window.bms.default.lazyLoad(['./assets/js_native/assets/js/routers/suppliers/profile.js'],{once:true})
	}
}).resolve()

