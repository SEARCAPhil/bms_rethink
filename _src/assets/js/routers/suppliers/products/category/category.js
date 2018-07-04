import Categories from '../../../../modules/Suppliers/Components/Products/Categories/Categories.js'
import Products from '../../../../modules/Suppliers/Components/Products/Products.js'
import CatTemplate from '../../../../modules/Suppliers/Templates/Products/Categories/Categories.js'
import CatUtilities from '../../../../modules/Suppliers/Util/Forms/Products/Category.js'
import PopupES from '../../../../Components/PopupES/PopupES.js'
import ProdUtilities from '../../../../modules/Suppliers/Util/Forms/Products/Products.js'


//window.bms.exports.PopupEs=PopupEs
const XHR=new window.bms.exports.XHR()
const appRoute=new window.bms.exports.Router('http://localhost/bms_rethink/www/',true)
const CatUtil = new CatUtilities()


let Cat=new Categories()
let Prod=new Products()
const ProdUtil=new ProdUtilities()
let PopupInstance



 appRoute.on({
 	'/*':()=>{
 		//required
 	},
	'/suppliers/:id/products/tabs/categories':(params)=>{
		window.bms.default.spinner.show()
		window.bms.default.changeDisplay(['route[name="/suppliers/products"]'],'block')
		window.bms.default.changeDisplay(['route[name="/suppliers/about"]','route[name="/suppliers/settings"]','route[name="/suppliers/logs"]','route[name="/suppliers/logs"]','route[name="/suppliers/accounts"]'],'none')
		
		ProdUtil.loadProductSection(params).then(()=>{
			window.bms.default.changeDisplay(['.category-container'],'block')
			window.bms.default.changeDisplay(['.product-profile-container','.product-container'],'none')

			//document.querySelector('.product-main-tabs > ul > li > a.categories').classList.add('active')
			//document.querySelector('.product-main-tabs > ul > li > a.all').classList.remove('active')

			//load menu
			CatUtil.loadCategorySection(params)
			CatUtil.loadCategories(params.id).then(e=>{
				window.bms.default.spinner.hide()
				PopupInstance=new PopupES()
				CatUtil.bindDeleteModalButton()
				CatUtil.bindUpdateModalButton()
			})
		
		}).catch(e=>{
			window.bms.default.spinner.hide()
		})
	},
	'/suppliers/:id/products/category/:cid':(params)=>{
		window.bms.default.spinner.show()


		ProdUtil.loadProductSection(params).then(()=>{

			window.bms.default.changeDisplay(['.product-container','.category-container'],'none')
			window.bms.default.changeDisplay(['.category-profile-container'],'block')

			let target = document.querySelector('.category-profile-container')

			Cat.view(params.cid).then((json)=>{


				var parsedData=JSON.parse(json)
				var data=parsedData.data

				let prodCreateBtn = document.createElement('button')
				prodCreateBtn.classList.add('btn','btn-sm','btn-secondary')
				prodCreateBtn.setAttribute('data-target','#product-modal')
				prodCreateBtn.setAttribute('data-popup-toggle','open')
				prodCreateBtn.textContent = 'add +'
				prodCreateBtn.addEventListener('click',ProdUtil.loadProductRegistrationModal.bind(ProdUtil))

				if(data[0]){
					//save to state
					if(!window.bms.default.state.supplier.products) window.bms.default.state.supplier.products = {}
					if(!window.bms.default.state.supplier.products.cur) window.bms.default.state.supplier.products.cur = {}
					if(!window.bms.default.state.supplier.products.cur.data) window.bms.default.state.supplier.products.cur.data = {}
					
					window.bms.default.state.supplier.products.cur.data = data[0]
					//DOM Update	
					data = data[0]
					target.innerHTML=`
						<h3>${data.name} <span class="category-product-create-button-section"></span></h3>
						<p>${data.description}</p>
						<br/>
						<h5>
							<span style="float:left;width:28px;height:28px;border-radius:50%;text-align:center;background:#009688;overflow:hidden;margin-left:10px;margin-right:10px;color:rgb(255,255,255);cursor:pointer;valign:bottom;padding:1px;">
								<i class="material-icons md-24">add_shopping_cart</i>
							</span>
							&nbsp;Products
						</h5>
						<div class="row category-product-table-section"></div>
					`
					document.querySelector('.category-product-create-button-section').append(prodCreateBtn)	
				}


				//DOM Table
				document.querySelector('.category-product-table-section').innerHTML+=`
					<table class="table product-table">
						<thead>
							<th>Product name <span class="category-product-add-section"></span></th>
							<th></th>
							<th>Price</th>
						</thead>
						<tbody>
							       
						</tbody>
					</table>
				`

				//get products
				Prod.listPerCategory({id:params.id,cat_id:params.cid}).then(json=>{
					var parsedData=JSON.parse(json)
					var data=parsedData.data

					if(data.length>0){
				
						//DOM Insert
						setTimeout(function() {
							let target = document.querySelector('.product-table tbody')
							

							for(let x=0; x<data.length;x++){
								//specs
								let specs = ''
								for(let y =0; y < data[x].specs.length; y++){
									specs+= `<p><b>${data[x].specs[y].name} :</b> ${data[x].specs[y].value}</p>`
								}
								
								//DOM
								let htm=`
									<tr>
										<td colspan="2">
											<details open>
												<summary>
													<a href="#/suppliers/${params.id}/products/${data[x].id}">${data[x].name}</a>
												</summary>
												<br/>
												<small>${specs}</small>
											</details>
										</td>
										<td></td>
									</tr>
								`

								target.innerHTML+=htm
								window.bms.default.spinner.hide()
							}

						}, 10);
					}


				})

				
				window.bms.default.spinner.hide()
				PopupInstance = new PopupES()

			})
		})
	}
}).resolve()

