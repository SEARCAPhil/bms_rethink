const appRoute=new window.bms.exports.AppRoute({root:'http://localhost/bms_rethink/www/'})
import Categories from '../../modules/Suppliers/Components/Products/Categories/Categories.js'
import CatTemplate from '../../modules/Suppliers/Templates/Products/Categories/Categories.js'

let Cat=new Categories()
let loadOnce=0

const loadProductSection=()=>{ 
	return new Promise((resolve,reject)=>{
		var html=`<section class="profile-tabs profile-tabs-about">
			<div class="profile-section">
				<h5><i class="material-icons md-18">shopping_basket</i> Products</h5>
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
	loadProductSection().then(()=>{
		Cat.categories(id).then((json)=>{
			var parsedData=JSON.parse(json)
			var data=parsedData.data
			if(data){
				var CatTemp=new CatTemplate()
				var el=document.querySelector('.product-container')
				for(let x of data){
					el.append(CatTemp.render({name:x.name,description:x.description,buttons:[]}))
				}

			}
			
			
		})
	})
}


appRoute.Navigo.on({
 	'/*':()=>{
 		//required
 	},
	'/suppliers/:id/products':(params)=>{ 

		if(!loadOnce){
			loadProd(params.id)
			loadOnce=1
		}

		if(window.bms.default.state.supplier.prev.id!=params.id){
			loadProd(params.id)
		}
	},
}).resolve()

