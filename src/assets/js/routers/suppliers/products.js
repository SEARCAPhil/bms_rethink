import Categories from '../../modules/Suppliers/Components/Products/Categories/Categories.js'
import Products from '../../modules/Suppliers/Components/Products/Products.js'
import CatTemplate from '../../modules/Suppliers/Templates/Products/Categories/Categories.js'
import ProdUtilities from '../../modules/Suppliers/Util/Forms/Products/Category.js'
import PopupES from '../../Components/PopupES/PopupES.js'

//window.bms.exports.PopupEs=PopupEs
const XHR=new window.bms.exports.XHR()
const appRoute=new window.bms.exports.Router('http://localhost/bms_rethink/www/',true)
const appRouteProd=new window.bms.exports.Router('http://localhost/bms_rethink/www/',true)
const ProdUtil = new ProdUtilities()


let Cat=new Categories()
let Prod=new Products()
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
				<div class="category-profile-container"></div>
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
						el.append(CatTemp.render({name:x.name,description:x.description,id:x.id,cid:x.company_id,buttons:['update','remove']}))
						resolve(this)
					}

				}else{
					reject(this)
				}
				
				
			})
	})
}

const getProducts=(cid,page=1)=>{
	Prod.lists({id:cid,page:page}).then((json)=>{
		var parsedData=JSON.parse(json)
		var data=parsedData.data

		if(data.length>0&&page==1){
			document.querySelector('.product-table-section').innerHTML=`
				<table class="table product-table">
							<thead>
								<th>Product name</th>
								<th>Description</th>
								<th>Price</th>
							</thead>
							<tbody>
								
							</tbody>
						</table>
			`
		}

		setTimeout(function() {
			let target = document.querySelector('.product-table tbody')

			for(let x=0; x<data.length;x++){
				target.innerHTML+=`
					<tr>
						<td><a href="#">${data[x].name}</a></td>
						<td></td>
						<td></td>
					</tr>
				`
			}

		}, 10);
	})
}


const prodInit=(params)=>{
	window.bms.default.changeDisplay(['route[name="/suppliers/products"]'],'block')
		window.bms.default.changeDisplay(['route[name="/suppliers/about"]','route[name="/suppliers/settings"]','route[name="/suppliers/logs"]','route[name="/suppliers/logs"]','route[name="/suppliers/accounts"]'],'none')
		

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
}


appRoute.on({
 	'/*':()=>{
 		//required
 	},
	'/suppliers/:id/products':(params)=>{ 
		
		prodInit(params);
		
	},
	'/suppliers/:id/products/category/:cid':(params)=>{ 
			prodInit(params);
			window.bms.default.spinner.show()
			window.bms.default.changeDisplay(['.product-container'],'none')
			window.bms.default.changeDisplay(['.category-profile-container'],'block')
			

			let target = document.querySelector('.category-profile-container')



			Cat.view(params.cid).then((json)=>{


				var parsedData=JSON.parse(json)
				var data=parsedData.data

				if(data[0]){
					data = data[0]
					target.innerHTML=`
						<h3>${data.name} <button class="btn btn-sm btn-secondary">add +</button></h3>
						<p>${data.description}</p>

						<div class="row product-table-section"></div>
					`	
				}
				getProducts(params.cid)
				window.bms.default.spinner.hide()

			})

			

	}
}).resolve()

