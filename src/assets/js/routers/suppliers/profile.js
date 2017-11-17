const appRoute=new window.bms.exports.AppRoute({root:'http://localhost/bms_rethink/www/'})
const appRouteID=new window.bms.exports.AppRoute({root:'http://localhost/bms_rethink/www/'})
import AboutClass from '../../modules/Suppliers/Components/About/About.js'
import {Suppliers,Profile} from './appRouteFunc.js'


var loadedOnce=0
let prev=window.bms.default.state.supplier.cur


const enableMenu=(id)=>{

	document.querySelectorAll('.tab-navigation').forEach((el,index)=>{
		if(el.id==id){
			el.classList.add('active')
			//show target elements
			document.getElementById(el.getAttribute('target')).style.display='block'
			//get all panels
			document.querySelectorAll('.tab-panel').forEach((el2,index)=>{
				if(el2.id==el.getAttribute('target')){
					el2.style.display="block"
				}else{
					el2.style.display='none'
				}
			})
		}else{
			el.classList.remove('active')
		} 
	})
}


const loadAbout=(e)=>{ 
	window.bms.default.spinner.hide()
	var data=e.detail.data
	
	document.querySelector('.company-alias').innerHTML=`<b>${data.alias||data.name}</b>`
	document.querySelector('.company-name').innerHTML=`${data.name}`

	let el=document.querySelector('route[name="/suppliers/about"]')
	var cont=`
		<section class="profile-tabs profile-tabs-about" style="display: block;">
			<div class="profile-section">
				<h5><i class="material-icons md-18">bookmark</i> About</h5>
				<hr>
				<p>${data.about}</p>
				<h5>Industry</h5><hr><p>`
				data.industry.split(',').forEach((val,index)=>{
						cont+=`<span class="badge badge-secondary">${val}</span> `
				})
				cont+=`
				</p>
			</div>
		</section>
			`	
	el.innerHTML=cont
}


const profileLoaded=()=>{
	//this is usefeul to determine if profile page is loaded
	//before doing any DOM manipulation
	return new Promise((resolve,reject)=>{
		var isLoaded=()=>{
				resolve(null)
		}

		document.removeEventListener('profloaded',isLoaded)
		document.addEventListener('profloaded',isLoaded)
	})
}


const loadEmpty=()=>{
	window.bms.default.spinner.hide()
	appRoute.hide(['/suppliers/profile'])
	appRoute.show(['/suppliers/empty'])
	let el=document.querySelector('route[name="/suppliers/empty"]')

	el.innerHTML=`
		<section class="profile-tabs profile-tabs-about" style="display: block;margin-top:15vh">
			<center>
				<h5>Sorry you are not allowed to view this profile.</h5>
				<p>You dont have the privilege to view this profile or error was encountered while serving the content<br/>
				You may try reloading the page. 
				<p/>
			</center>
		</section>`	
}


const listenOnAboutChanges=()=>{
	//will only run durinf the first full page load
	//this must be included in other routes under profile to make sure
	//that profile is loaded
	var loadAboutOnce=()=>{
		loadAbout({detail:window.bms.default.state.supplier.cur})
		loadedOnce=1
	}

	if(!loadedOnce){
		document.addEventListener('profloaded',loadAboutOnce)
		setTimeout(()=>{ document.removeEventListener('profloaded',loadAboutOnce)},300)
	}
}


 appRouteID.Navigo.on({
 	'/suppliers/:id/*':(params)=>{
 		
 		if(!appRoute.is('/suppliers')){
 			let Sup=new Suppliers(appRoute)

			Sup.then(()=>{
				let Prof=new Profile(appRoute)
 				Prof.then(()=>{
 					//send signal to listeners that profile page DOM is ready
 					var ab=new CustomEvent('profloaded')
 					document.dispatchEvent(ab)

 				})
 			}).catch(e=>{
 				console.log(e)
 			})
 		}
 	}
 }).resolve()



 appRoute.Navigo.on({
 	'/*':()=>{
 		//required
 	},
	'/suppliers/:id/about':(params)=>{
		enableMenu('about-tab')
		document.removeEventListener('aboutchange',loadAbout)
		document.addEventListener('aboutchange',loadAbout)

		listenOnAboutChanges()
		profileLoaded().then(()=>{
			enableMenu('about-tab')	
		})
		
	},
	'/suppliers/:id/products':(params)=>{ 
		enableMenu('products-tab')
		listenOnAboutChanges()

		profileLoaded().then(()=>{
			enableMenu('products-tab')	
		})
			
		window.bms.default.lazyLoad(['./assets/js_es/routers/suppliers/products.js'],{once:true,module:true})
	},
}).resolve()

