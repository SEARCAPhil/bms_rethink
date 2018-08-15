export class Suppliers{
	constructor(appRoute){
		//require appRoute instance from the parent script
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
}



export class Profile{
	constructor(appRoute){
		//require appRoute instance from the parent script
		
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
}