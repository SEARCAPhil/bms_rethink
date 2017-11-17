const appRoute=new window.bms.exports.AppRoute({root:'http://localhost/bms_rethink/www/'})
import AboutClass from '../../modules/Suppliers/Components/About/About.js'
import {Suppliers} from './appRouteFunc.js'

//stores the ID of previously fetched profile
window.bms.default.state.supplier.prev={
	id:null,
	data:null
}

let prev=window.bms.default.state.supplier.prev


const getAbout=(id)=>{
	var About=new AboutClass()
	return new Promise((resolve,reject)=>{

		//intercept
		if(prev.id==id){
			resolve(prev.data)
		}else{
			//get supplier's info via AJAX
			About.about(id).then(json=>{
				var data=JSON.parse(json)	
				if(data.data){
					var about=data.data.data[0]

					if(about){
						//saved to previous
						prev.id=id
						prev.data=about
						resolve(about)
					}else{
						//show empty response
						reject({error:1})				
					}
				}
			})
		}
	})	
}



 appRoute.Navigo.on({
 	'/*':()=>{
 		//this is required to always treat suppliers as separate route
 		//without this, link will stop working after a few clicks
 	},
	'/suppliers/all':()=>{
		return new Suppliers(appRoute)
	},
	'/suppliers/:id/*':(params)=>{ 
		getAbout(params.id).then(data=>{
			window.bms.default.state.supplier.cur={}
			window.bms.default.state.supplier.cur.id=data.id
			window.bms.default.state.supplier.cur.data=data

			var ab=new CustomEvent('aboutchange',{detail:window.bms.default.state.supplier.cur})
 			document.dispatchEvent(ab)


			//load profile routes , about , products , etc 
			window.bms.default.lazyLoad(['./assets/js_es/routers/suppliers/profile.js'],{once:true,module:true})
		})
	}
}).resolve()

