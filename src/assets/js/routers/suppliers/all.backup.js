
const appRoute=new window.bms.exports.AppRoute({root:'http://127.0.0.1/bms_rethink/www/'})

const enableMenu=(id)=>{
	document.querySelectorAll('.tab-navigation').forEach((el,index)=>{
		el.classList.remove('active')
		if(el.id==id) el.classList.add('active')
	})
}


const loadSuppliers=()=>{
	return new Promise((resolve,reject)=>{
		window.bms.default.activateMenu('supplies')

		appRoute.hide(['/home'])
		//route
		appRoute.route('/suppliers',{once:true}).then(res=>{ 
			window.bms.default.spinner.hide()
			resolve(appRoute)
		}).catch((err)=>{
			if(err.code==304) resolve(appRoute)
		})
	})	
}



const loadProfile=()=>{

	return new Promise((resolve,reject)=>{
		window.bms.default.activateMenu('supplies')
			
		appRoute.route('/suppliers/profile',{once:true}).then(res=>{ 
			appRoute.reset(['/suppliers/about','/suppliers/products','/suppliers/accounts','/suppliers/logs'])
			resolve(appRoute)
		}).catch((err)=>{
			if(err.code==304) resolve(appRoute)
		})
	})	
}


const loadAbout=()=>{
	enableMenu('about-tab')
	appRoute.hide(['/suppliers/products','/suppliers/accounts','/suppliers/logs','/suppliers/settings'])
	appRoute.route('/suppliers/about',{once:true}).then(res=>{ 

	})
}


const loadProducts=()=>{
	enableMenu('products-tab')
		appRoute.hide(['/suppliers/about','/suppliers/accounts','/suppliers/logs','/suppliers/settings'])
		appRoute.route('/suppliers/products',{once:true}).then(res=>{ 
			
	})
}

const loadAccounts=()=>{
	enableMenu('accounts-tab')
	appRoute.hide(['/suppliers/about','/suppliers/products','/suppliers/logs','/suppliers/settings']) 
	appRoute.route('/suppliers/accounts',{once:true}).then(res=>{ 
	})
}


const loadLogs=()=>{
	enableMenu('logs-tab')
	appRoute.hide(['/suppliers/about','/suppliers/products','/suppliers/accounts','/suppliers/settings']) 
	appRoute.route('/suppliers/logs',{once:true}).then(res=>{ 
	})
}


const loadSettings=()=>{
	enableMenu('settings-tab')
	appRoute.hide(['/suppliers/about','/suppliers/products','/suppliers/accounts','/suppliers/logs']) 
	appRoute.route('/suppliers/settings',{once:true}).then(res=>{ 
	})
}




 appRoute.Navigo.on({
 	'*':()=>{
 		console.log(appRoute.Navigo)
 	},
	'/suppliers/all':()=>{
		console.log('h') 
		loadSuppliers()
	},
	'/suppliers/:id/profile':(params)=>{ 
		if(!appRoute.is('/suppliers/list')){
			loadSuppliers().then(e=>{
				loadProfile()	
			})
		}else{
			loadProfile()	
		} 	
	},

	'/suppliers/:id/about':(params)=>{
		if(!appRoute.is('/suppliers')){
			loadSuppliers().then(()=>{
				loadProfile().then(()=>{
					loadAbout()
				})
			})
			
		}else{ loadAbout() }

	},
	'/suppliers/:id/products':()=>{ 
		if(!appRoute.is('/suppliers')){
			loadSuppliers().then(()=>{
				loadProfile().then(()=>{
					loadProducts()
				})
			})
		}else{ loadProducts()}
	},
	'/suppliers/:id/accounts':()=>{
		if(!appRoute.is('/suppliers')){
			loadSuppliers().then(()=>{
				loadProfile().then(()=>{
					loadAccounts()
				})
			})
		}else{ loadAccounts() }
	},
	'/suppliers/:id/logs':()=>{ 
		if(!appRoute.is('/suppliers')){
			loadSuppliers().then(()=>{
				loadProfile().then(()=>{
					loadLogs()
				})
			})
		}else{ loadLogs() }
	},
	'/suppliers/:id/settings':()=>{ 
		if(!appRoute.is('/suppliers')){
			loadSuppliers().then(()=>{
				loadProfile().then(()=>{
					loadSettings()
				})
			})
		}else{ loadSettings() }
	}	,
	'/suppliers/forms/registration':()=>{ 
		console.log('reg')
	}
}).resolve()

