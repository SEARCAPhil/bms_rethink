const appRoute=new window.bms.exports.Router('http://localhost/bms_rethink/www/',true)
//import PopupEs from '../../../../../node_modules/popup-es/src/js/popup-es.js'
import Categories from '../../modules/Suppliers/Components/Products/Categories/Categories.js'
import CatTemplate from '../../modules/Suppliers/Templates/Products/Categories/Categories.js'

//window.bms.exports.PopupEs=PopupEs
let Cat=new Categories()

const loadProductSection=()=>{ 
	return new Promise((resolve,reject)=>{
		var html=`<section class="profile-tabs profile-tabs-about">
			<div class="profile-section">
				<hr/>
				<div class="product-container"></div>
			</div>
		</section>`

		let el=document.querySelector('route[name="/suppliers/products"]')
		el.innerHTML=html

		resolve(el)
	})
	


}

const loadProd=(id)=>{
	return new Promise((resolve,reject)=>{
		loadProductSection().then(()=>{
			Cat.categories(id).then((json)=>{
				var parsedData=JSON.parse(json)
				var data=parsedData.data

				//empty
				if(data.length<1) reject(this)

				if(data){
					var CatTemp=new CatTemplate()
					var el=document.querySelector('.product-container')
					for(let x of data){
						el.append(CatTemp.render({name:x.name,description:x.description,buttons:[]}))
						resolve(this)
					}

				}else{
					reject(this)
				}
				
				
			})
		})
	})
}


appRoute.on({
 	'/*':()=>{
 		//required
 	},
	'/suppliers/:id/products':(params)=>{ 

		window.bms.default.changeDisplay(['route[name="/suppliers/about"]','route[name="/suppliers/settings"]'],'none')
		window.bms.default.changeDisplay(['route[name="/suppliers/products"]'],'block')

		loadProd(params.id).then(e=>{
			window.bms.default.spinner.hide()
		}).catch((e)=>{
			window.bms.default.spinner.hide()
			//empty product
			document.querySelector('.product-container').innerHTML=`
				<center style="margin-top:50px;">
					<p><i class="material-icons md-48 text-muted">shopping_basket</i></p>
					<h5>No Available Product</h5>
				</center>
			`
		})
	},
}).resolve()

