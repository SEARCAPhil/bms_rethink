const appRoute=new window.bms.exports.Router('http://localhost/bms_rethink/www/',true)
const appRouteProd=new window.bms.exports.Router('http://localhost/bms_rethink/www/',true)

//stores the ID of previously fetched profile
window.bms.default.state.supplier.cur={
	id:null,
	data:null
}
window.bms.default.pages=[]
window.bms.default.spinner=new window.bms.exports.Spinner({
	target:'div[name="/suppliers/profile"]',
	class:'spinner'
})

let cur=window.bms.default.state.supplier.cur
const XHR=new window.bms.exports.XHR()


const loadSuppliers=()=>{
	return new Promise((resolve,reject)=>{
		//intercept
		//do not perform a request if it is already loaded
		////this will serve as the middleware
		if(window.bms.default.pages.indexOf('list.html')!=-1){
			resolve({error:1,message:'page already loaded'})
			return 0;
		}

		XHR.request({url:'./pages/suppliers/list/list.html',method:'GET'}).then((data)=>{
			var targ=document.querySelector('div[name="/suppliers"]')
			targ.innerHTML=data
			setTimeout(()=>{
				window.bms.default.scriptLoader(targ)
			},50)
			window.bms.default.pages.push('list.html')
			resolve(data)
		})
	}) 	
}

const loadProfilePage=(id)=>{
	return new Promise((resolve,reject)=>{
		//intercept
		//do not perform a request if it is already loaded
		////this will serve as the middleware
		if(window.bms.default.pages.indexOf('profile.html')!=-1){
			resolve({error:1,message:'page already loaded'})
			return 0;
		}

		//perform network request
		XHR.request({url:'./pages/suppliers/profile/profile.html',method:'GET'}).then((data)=>{
			var targ=document.querySelector('div[name="/suppliers/profile"]')
			targ.innerHTML=data
			setTimeout(()=>{
				window.bms.default.scriptLoader(targ)
			},100)

			window.bms.default.pages.push('profile.html')

			resolve(data)
		})
	}) 		
}


const getSuppLiersInfo=(id)=>{
	const XHR=new window.bms.exports.XHR()
	return new Promise((resolve,reject)=>{
		XHR.request({url:`http://localhost/bms_api/src/api/suppliers/?id=${id}`,method:'GET'}).then((data)=>{
			var res=JSON.parse(data)
			resolve(res.data)
		}).catch(e=>{
			reject(e)
		})
	}) 		
}



const changeProfileInfo=(data)=>{
	var details=(data.detail.data[0])
	window.bms.default.state.supplier.cur.id=details.id
	window.bms.default.state.supplier.cur.data=details
	document.querySelector('.company-alias').innerHTML=details.alias||''
	document.querySelector('.company-name').innerHTML=details.name||''

	//set as currently selected
	window.bms.default.state.supplier.cur.data=details

	//logo
	if(details.logo){
		document.querySelector('.logo-section').innerHTML=`<img src="assets/img/searca-logo.png" width="100%" style="max-width: 80px;">`
	}else{
		document.querySelector('.logo-section').innerHTML=''
	} 

	let lg = window.getComputedStyle(document.querySelector('.hidden-on-lg')).display

	if(lg!='none'){
		let listSidebar = document.querySelector('div[name="/suppliers"]')
		listSidebar.classList.add('hide')

		let profSection = document.querySelector('div[name="/suppliers/profile"]')
		profSection.classList.add('show')
	}


	//back to list
	document.querySelector('.back-to-list-button').addEventListener('click',backToList)
	
}

const changeMenuLink=(id)=>{
	document.querySelector('#about-tab').childNodes[0].href=`#/suppliers/${id}/about`
	document.querySelector('#products-tab').childNodes[0].href=`#/suppliers/${id}/products`
	document.querySelector('#accounts-tab').childNodes[0].href=`#/suppliers/${id}/accounts`
	document.querySelector('#logs-tab').childNodes[0].href=`#/suppliers/${id}/logs`
	document.querySelector('#settings-tab').childNodes[0].href=`#/suppliers/${id}/settings`
}

const loadRegistration=()=>{
	return new Promise((resolve,reject)=>{
		XHR.request({url:'./pages/suppliers/forms/registration/registration.html',method:'GET'}).then((data)=>{
			var el=document.querySelector('div[name="/suppliers/forms/registration"]')

			el.innerHTML=data

			setTimeout(()=>{
				window.bms.default.scriptLoader(el)
			},100)

			resolve(data)
		})
	}) 
	
}

const backToList=(e)=>{
	e.preventDefault()
	let profSection = document.querySelector('div[name="/suppliers/profile"]')
	let listSidebar = document.querySelector('div[name="/suppliers"]')

	//show list and hide profile
	listSidebar.classList.remove('hide','show')
	profSection.classList.remove('show')
}

const loadInit=(params)=>{
	window.bms.default.changeDisplay(['div[name="/suppliers/profile"]'],'block')
	window.bms.default.changeDisplay(['div[name="/suppliers/forms/registration/update"]','div[name="/suppliers/forms/registration"]'],'none')
	

	//if(window.bms.default.state.supplier.cur.id==params.id) return 0;

	//set active
	document.querySelectorAll('.list').forEach((el,index)=>{
		if(el.getAttribute('data-list')==params.id){
			el.classList.add('active')
		}else{
			el.classList.remove('active')
		}
	})


	loadProfilePage(1).then(e=>{
		changeMenuLink(params.id)
		document.removeEventListener('profilechange',changeProfileInfo)
		document.addEventListener('profilechange',changeProfileInfo)

	}).catch((e)=>{
		
	})

	getSuppLiersInfo(params.id).then(data=>{
		var e=new CustomEvent('profilechange',{detail:data})
		document.dispatchEvent(e)

	}).catch(e=>{
		console.log(e)
	})

}

 appRoute.on({
 	'/*':()=>{
 		//this is required to always treat suppliers as separate route
 		//without this, link will stop working after a few clicks
 	},
	'/suppliers/all':()=>{
		window.bms.default.spinner.show()
		loadSuppliers()
		

	let suppliersSection = document.querySelector('div[name="/suppliers"]')

	//if(!suppliersSection.classList.contains('dom-loaded')){
		window.bms.default.changeDisplay(['div[name="/suppliers"]','div[name="/suppliers/profile"]','div[name="/suppliers/forms/registration"]'],'block')	
	//	suppliersSection.classList.add('dom-loaded')
	//}



	},
	'/suppliers/blocked':()=>{
		window.bms.default.spinner.show()
		loadSuppliers()
	},
	'/suppliers/forms/registration':()=>{
		window.bms.default.changeDisplay(['div[name="/suppliers/forms/registration"]'],'block')
		window.bms.default.changeDisplay(['div[name="/suppliers/forms/registration/update"]','div[name="/suppliers/profile"]','route[name="/suppliers/products"]','route[name="/suppliers/settings"]','route[name="/suppliers/logs"]'],'none')
		
		

		//toggle list sidebar for medium and small devices
		let lg = window.getComputedStyle(document.querySelector('.hidden-on-lg')).display

		if(lg=='block'){
			window.bms.default.changeDisplay(['div[name="/suppliers"]'],'none')	
		}

	
		if(window.bms.default.pages.indexOf('list.html')==-1){
			loadSuppliers().then(()=>{

				loadRegistration()
			})
		}else{
			loadRegistration()
		}
	},
	'/suppliers/:id/about':(params)=>{
		loadInit(params)		
	},
	'/suppliers/:id/products':(params)=>{
		loadInit(params)	
	},
	'/suppliers/:id/accounts':(params)=>{
		loadInit(params)	
	},
	'/suppliers/:id/logs':(params)=>{
		loadInit(params)	
	},
	'/suppliers/:id/settings':(params)=>{
		loadInit(params)	
	},
	'/suppliers/:id/products/category/:cid':(params)=>{
		loadInit(params)	
	},
	'/suppliers/:id/products/:pid':(params)=>{
		loadInit(params)	
	},
	'/suppliers/:id/products/tabs/categories':(params)=>{
		loadInit(params)
	}
}).resolve()

