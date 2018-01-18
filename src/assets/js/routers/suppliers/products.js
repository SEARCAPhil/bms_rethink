import Categories from '../../modules/Suppliers/Components/Products/Categories/Categories.js'
import Products from '../../modules/Suppliers/Components/Products/Products.js'
import ProdUtilities from '../../modules/Suppliers/Util/Forms/Products/Products.js'
import PopupES from '../../Components/PopupES/PopupES.js'

const Cat=new Categories()
const Prod=new Products()
const ProdUtil=new ProdUtilities()

//window.bms.exports.PopupEs=PopupEs
const XHR=new window.bms.exports.XHR()
const appRoute=new window.bms.exports.Router('http://localhost/bms_rethink/www/',true)

let PopupInstance




const loadProductInit=(params)=>{

	window.bms.default.changeDisplay(['route[name="/suppliers/products"]'],'block')
	window.bms.default.changeDisplay(['route[name="/suppliers/about"]','route[name="/suppliers/settings"]','route[name="/suppliers/logs"]','route[name="/suppliers/logs"]','route[name="/suppliers/accounts"]'],'none')


	let page = 1
	ProdUtil.loadProductSection(params).then(()=>{
		Prod.lists({id:params.id}).then(json=>{
			var parsedData=JSON.parse(json)
			var data=parsedData.data


			if(data.length>0&&page==1){
				document.querySelector('.product-table-section-main').innerHTML+=`
					<table class="table product-table">
						<thead>
							<th>Product name <span class="product-add-section"></span></th>
							<th></th>
							<th>Price</th>
						</thead>
						<tbody>
							       
						</tbody>
					</table>
				`
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
									<details>
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

				//create button
				let prodCreateBtn = document.createElement('button')

				prodCreateBtn.classList.add('btn','btn-sm','btn-dark')
				prodCreateBtn.setAttribute('data-target','#product-modal')
				prodCreateBtn.setAttribute('data-popup-toggle','open')
				prodCreateBtn.textContent = 'add +'

				prodCreateBtn.addEventListener('click',ProdUtil.loadProductRegistrationModal)

				document.querySelector('.product-add-section').append(prodCreateBtn)

				PopupInstance = new PopupES()


			}else{
				window.bms.default.spinner.hide()
				//empty product list
			}
		})
	})
}




appRoute.on({
 	'/*':()=>{
 		//required
 	},
	'/suppliers/:id/products':(params)=>{ 
		loadProductInit(params)
	},
	'/suppliers/:id/products/:pid':(params)=>{ 

		window.bms.default.spinner.show()

		window.bms.default.changeDisplay(['.product-profile-container'],'block')

		ProdUtil.loadProductSection(params).then(()=>{
			//hide product list
			window.bms.default.changeDisplay(['.product-container','.category-profile-container'],'none')

			ProdUtil.getInfo(params.pid).then(data=>{
				
				let target = document.querySelector('.product-profile-container')

				//delete button
				let delProdBtn = document.createElement('button')
				delProdBtn.classList.add('btn','btn-sm','btn-danger','product-delete-modal-button')
				delProdBtn.setAttribute('data-target','#product-modal')
				delProdBtn.setAttribute('data-popup-toggle','open')
				delProdBtn.textContent = '- Delete'
				delProdBtn.addEventListener('click',ProdUtil.loadRemoveProductModal.bind(ProdUtil))

				//DOM insert
				target.innerHTML=`
					<h3>${data.name}</h3>
					<span class="product-menu-section">
						<button class="btn btn-sm btn-dark product-update-modal-button">Update</button>&nbsp; 
					</span>
					
					<div class="specs-section" style="margin-top:60px;"></div>
				`

				setTimeout(()=>{
					let specsSection = document.querySelector('.specs-section')
					let prodMenuSection = document.querySelector('.product-menu-section')

					//Menu
					prodMenuSection.append(delProdBtn)

					//specs
					let specs = ''

					for(let y =0; y < data.specs.length; y++){
						specs+= `<p><b>${data.specs[y].name} :</b> ${data.specs[y].value}</p>`
					}

					specsSection.innerHTML+=specs

					PopupInstance = new PopupES()

				},10)
				
				window.bms.default.spinner.hide()	
			})
		})
	}
}).resolve()

