class AppRoute{
	constructor(conf={}){
		this.Navigo=new window.bms.exports.Router()
		this.XHR=new window.bms.exports.XHR()
		this.XHR.conf=conf
		this.XHR.conf.abort=conf.abort||false
		this.abort=()=>{}
		this.routed=[]
		this.current=null
	}
	_display(display,name=[]){

		for(let n of name){
			document.querySelectorAll(`route[name="${n}"]`).forEach((el,index)=>{
				if(display=="show"&&el.children[0]){
					el.children[0].style.display="block"
				} 

				if(display=="hide"&&el.children[0]){
					el.children[0].style.display="none"
					
				} 
			})	
		}
	}
	is(name){
		return this.current==name
	}
	route(name,opt={}){
		//active state
		this.current=name

		if(opt.once&&this.routed.indexOf(name)!=-1){
			this.show([name])
			return new Promise((res,rej)=>{rej({code:304,message:'route already loaded'})})
		}else{
			//mark as routed
			this.routed.push(name)
		}

		//make abort() available to AppRoute namespace
		this.abort=this.XHR.abort||(()=>{})
		//abort previous request
		if(this.XHR.conf.abort){
			 if(typeof this.XHR.abort!='undefined'){
			 	this.XHR.abort() 
			 } 	 	
		}

		let r=document.querySelectorAll(`route[name="${name}"]`)
		return new Promise((resolve,reject)=>{
			r.forEach((el,index)=>{
				this.show([name])
				//XHR	
				appRoute.XHR.request({method:'GET',url:el.getAttribute('page')}).then(res=>{
					el.innerHTML=res
					this.show([name])
					window.bms.default.scriptLoader(el)
					resolve(this)
				})
			})
		})

	}

	reset(name=[]){
		for(let n of name){
			//remove from list of loaded routes
			var r=this.routed.indexOf(n)
			if(r!=-1){
				this.routed.splice(r,1)
				console.log(this.routed)
				console.log(r)	
			}
		}
		
	}

	show(name){
		this._display('show',name)
	}
	hide(name){
		this._display('hide',name)
	}

}


const appRoute=new AppRoute()


const loadHome=()=>{

	
	//abort all request
	appRoute.abort()
	window.bms.default.activateMenu('home')


	appRoute.hide(['/suppliers'])
	//route once
	appRoute.route('/home',{once:true}).then(res=>{ 
		window.bms.default.spinner.hide()
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
			appRoute.reset(['/suppliers/about','/suppliers/products','/suppliers/accounts'])
			resolve(appRoute)
		}).catch((err)=>{
			if(err.code==304) resolve(appRoute)
		})
	})	
}


const loadAbout=()=>{
	appRoute.route('/suppliers/about',{once:true}).then(res=>{ 

	})
}



appRoute.Navigo.on({
	'/home':(e)=>{ 
		loadHome()
	},
	'/suppliers':()=>{ 
		loadSuppliers()
	},
	'/suppliers/:id/profile':(params)=>{ 
		if(!appRoute.is('/suppliers')){
			loadSuppliers()
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
			
		}else{

		} 


		//loadProfile()
		//appRoute.route('/suppliers/about',{once:true}).then(res=>{ 

		//})

	},
	'/suppliers/:id/products':()=>{ 
		appRoute.hide(['/suppliers/about','/suppliers/accounts'])
		appRoute.route('/suppliers/products',{once:true}).then(res=>{ 
			
		})
	},
	'/suppliers/:id/accounts':()=>{
		appRoute.hide(['/suppliers/about','/suppliers/products']) 
		appRoute.route('/suppliers/accounts',{once:true}).then(res=>{ 
		})
	},
	'/suppliers/:id/logs':()=>{ 
		console.log('loading suppliers logs')
	}
})
appRoute.Navigo.resolve()

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
