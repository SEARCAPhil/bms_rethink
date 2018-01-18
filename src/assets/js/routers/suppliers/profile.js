import AboutClass from '../../modules/Suppliers/Components/About/About.js'
import ListUtilities from '../../modules/Suppliers/Util/List/List.js'

const appRoute=new window.bms.exports.Router('http://localhost/bms_rethink/www/',true)
const appRouteList=new window.bms.exports.Router('http://localhost/bms_rethink/www/',true)
const ListUtil = new ListUtilities()

var loadedOnce=0
let spinner=window.bms.default.spinner
let prev=window.bms.default.state.supplier.cur


const loadData=(data)=>{
	
	var industries=''
	var ind=data.industry.split(',')

	var about=''
	ind.forEach((val,index)=>{
		industries+=`<span class="badge badge-secondary" style="margin-right:5px;">${val}</span>`
	})

	about=(data.about.length>1000)?data.about.substring(0,1000)+`<a href="#" onclick="event.preventDefault();this.parentNode.innerHTML=this.getAttribute('data-content')" data-content="${data.about}">. . .  read more</a>`:data.about

	document.querySelector('#profile-tab-navigation').innerHTML=`
		<h5>Industry</h5><hr/>
		<p>${industries}</p><br/><br/>
		<h5>About</h5><hr/>
		<p>${about}</p>
	`
}

const activateTabNavigation=(id)=>{
	document.querySelectorAll('.tab-navigation').forEach((el,index)=>{
		if(el.getAttribute('id')==id){
			el.classList.add('active')
		}else{
			el.classList.remove('active')
		}
	})
}
 appRouteList.on({
 	'/*':()=>{
 		//required
 	},
	'/suppliers/:id/*':(params)=>{

		if(window.bms.default.pages.indexOf('list.html')==-1){
			ListUtil.loadSuppliersSection().then(htm=>{
				//lazyload additional script
				window.bms.default.lazyLoad(['./assets/js_native/assets/js/routers/suppliers/list.js'],{once:true})
				ListUtil.loadAllSuppliers().then(()=>{
					//set as loaded
					window.bms.default.pages.push('list.html')
				})
			})	
		}
		
		
	}
}).resolve()

 appRoute.on({
 	'/*':()=>{
 		//required
 	},
	'/suppliers/:id/about':(params)=>{
		activateTabNavigation('about-tab')
		spinner.show()
		window.bms.default.changeDisplay(['route[name="/suppliers/about"]'],'block')
		window.bms.default.changeDisplay(['route[name="/suppliers/products"]','route[name="/suppliers/settings"]','route[name="/suppliers/accounts"]','route[name="/suppliers/logs"]'],'none')

		const About=new AboutClass()
		About.about(params.id).then(json=>{
			var data=(JSON.parse(json).data.data)
			loadData(data[0])
			spinner.hide()
		})
	},
	'/suppliers/:id/products':(params)=>{
		activateTabNavigation('products-tab')
		spinner.show()
		window.bms.default.lazyLoad(['./assets/js_native/assets/js/routers/suppliers/products.js'],{once:true})
	},
	'/suppliers/:id/settings':(params)=>{
		activateTabNavigation('settings-tab')
		window.bms.default.lazyLoad(['./assets/js_native/assets/js/routers/suppliers/settings.js'],{once:true})
	},
	'/suppliers/:id/logs':(params)=>{
		activateTabNavigation('logs-tab')
		window.bms.default.lazyLoad(['./assets/js_native/assets/js/routers/suppliers/logs.js'],{once:true})
	},
	'/suppliers/:id/accounts':(params)=>{
		activateTabNavigation('accounts-tab')
		window.bms.default.lazyLoad(['./assets/js_native/assets/js/routers/suppliers/accounts.js'],{once:true})
	},
	'/suppliers/:id/products/category/:cid':(params)=>{
		activateTabNavigation('products-tab')
		spinner.show()
		window.bms.default.lazyLoad(['./assets/js_native/assets/js/routers/suppliers/products/category.js'],{once:true})
	},
	'/suppliers/:id/products/:pid':(params)=>{
		activateTabNavigation('products-tab')
		spinner.show()
		window.bms.default.lazyLoad(['./assets/js_native/assets/js/routers/suppliers/products.js'],{once:true})
	},
	'/suppliers/:id/products/tabs/categories':(params)=>{
		activateTabNavigation('products-tab')
		spinner.show()
		window.bms.default.lazyLoad(['./assets/js_native/assets/js/routers/suppliers/products/category/category.js'],{once:true})
	}
}).resolve()

