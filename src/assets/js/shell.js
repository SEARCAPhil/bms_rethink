
//window.bms.default.appRouteInstance=
//inject to global to be used by all the routers
//running in a single pipeline
//we can use the approute in exports to create a
//new router instance
const appRoute=new window.bms.exports.AppRoute({root:'http://localhost/bms_rethink/www/'})


const enableMenu=(id)=>{
	document.querySelectorAll('.tab-navigation').forEach((el,index)=>{
		el.classList.remove('active')
		if(el.id==id) el.classList.add('active')
	})
}

const loadHome=()=>{

	//abort all request
	//appRoute.abort()
	window.bms.default.activateMenu('home')


	appRoute.hide(['/suppliers'])
	//route once
	appRoute.route('/home',{once:true,window:true}).then(res=>{ 
		window.bms.default.spinner.hide()
	}).catch(e=>{})

}



appRoute.Navigo.on({
	'/home':(e)=>{ 
		loadHome()
	},
	'/suppliers/*':()=>{
			window.bms.default.lazyLoad(['./assets/js_native/assets/js/routers/suppliers/suppliers.js'],{once:true})
	}
}).resolve()

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
