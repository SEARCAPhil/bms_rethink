class AppRoute{
	constructor(){
		this.Navigo=new window.bms.exports.Router()
		this.XHR=new window.bms.exports.XHR()
	}
	route(name){
		return new Promise((resolve,reject)=>{
			document.querySelectorAll(`route[name="${name}"]`).forEach((el,index)=>{
				//XHR	
				appRoute.XHR.request({method:'GET',url:el.getAttribute('page')}).then(res=>{
					el.innerHTML=res
					resolve(this)
				})
			})
		})

	}

}

const appRoute=new AppRoute()

appRoute.Navigo.on({
	'/home':(e)=>{ 
		appRoute.route('/home').then(res=>{ 
			window.bms.default.spinner.hide()
		})

			},
	'/suppliers':()=>{ 
				console.log('loading suppliers')
			},
	'/suppliers/:id/profile':(params)=>{ 
			console.log('loading suppliers profile')
	},
	'/suppliers/:id/products':()=>{ 
		console.log('loading suppliers products')
	},
	'/suppliers/:id/accounts':()=>{ 
		console.log('loading suppliers accounts')
	},
	'/suppliers/:id/logs':()=>{ 
		console.log('loading suppliers logs')
	}
})
appRoute.Navigo.resolve()

navigator.serviceWorker.register('../sw.js').then(reg=>{
	var newWorker = reg.installing;
    console.log(newWorker)
    if(newWorker){
    	// statechange fires every time the ServiceWorker.state changes
	    newWorker.onstatechange = function() {
	    	 if (newWorker.state == 'activated' && !navigator.serviceWorker.controller) {
	    		console.log('sgfhfghgfh')
	    	}
	    }
    }
 

}).catch(err=>{
	console.log(err)
})
