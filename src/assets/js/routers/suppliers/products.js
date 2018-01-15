import Categories from '../../modules/Suppliers/Components/Products/Categories/Categories.js'
import CatTemplate from '../../modules/Suppliers/Templates/Products/Categories/Categories.js'
import ProdUtilities from '../../modules/Suppliers/Util/Forms/Products/Category.js'
import PopupES from '../../Components/PopupES/PopupES.js'

//window.bms.exports.PopupEs=PopupEs
const XHR=new window.bms.exports.XHR()
const appRoute=new window.bms.exports.Router('http://localhost/bms_rethink/www/',true)
const ProdUtil = new ProdUtilities()


let Cat=new Categories()
let PopupInstance

const loadProductSection=()=>{ 
	return new Promise((resolve,reject)=>{
		var html=`<section class="profile-tabs profile-tabs-about">
			<dialog id="product-modal" data-popup="fade">
					<div class="content">
						<!--close button-->
						<a href="#" data-popup-toggle="close">x</a>
						<div class="header"></div>
						<div class="body" id="modal-product-body"></div>
					</div>	
				</dialog>

			<div class="profile-section">
				<div class="product-menu-section"></div>
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
			Cat.categories(id).then((json)=>{
				var parsedData=JSON.parse(json)
				var data=parsedData.data

				//empty
				if(data.length<1) reject(this)

				if(data){
					var CatTemp=new CatTemplate()
					var el=document.querySelector('.product-container')
					for(let x of data){
						el.append(CatTemp.render({name:x.name,description:x.description,id:x.id,buttons:['update','remove']}))
						resolve(this)
					}

				}else{
					reject(this)
				}
				
				
			})
	})
}






appRoute.on({
 	'/*':()=>{
 		//required
 	},
	'/suppliers/:id/products':(params)=>{ 

		window.bms.default.changeDisplay(['route[name="/suppliers/about"]','route[name="/suppliers/settings"]','route[name="/suppliers/logs"]','route[name="/suppliers/logs"]','route[name="/suppliers/accounts"]'],'none')
		window.bms.default.changeDisplay(['route[name="/suppliers/products"]'],'block')

		loadProductSection().then(()=>{
				//load menu
				ProdUtil.loadCategorySection()


			loadProd(params.id).then(e=>{
				window.bms.default.spinner.hide()
				PopupInstance=new PopupES()
				 ProdUtil.bindDeleteModalButton()
				 ProdUtil.bindUpdateModalButton()
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
		})

		
	},
}).resolve()

