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
				<div class="category-menu-section"></div>
				<hr/>
				<div class="product-container"></div>
				<div class="category-profile-container"></div>
				<div class="product-profile-container"></div>
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

	const id = window.bms.default.state.supplier.cur.id

	Prod.lists({id:cid,page:page}).then((json)=>{
		var parsedData=JSON.parse(json)
		var data=parsedData.data


		if(data.length>0&&page==1){
			document.querySelector('.product-table-section').innerHTML=`
				<table class="table product-table">
							<thead>
								<th>Product name</th>
								<th></th>
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
									<a href="#/suppliers/${id}/products/${data[x].id}">${data[x].name}</a>
								</summary>
								<br/>
								<small>${specs}</small>
							</details>
						</td>
						<td></td>
					</tr>
				`

				target.innerHTML+=htm
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


const loadProductRegistrationModal=()=>{

		const XHR = new window.bms.exports.XHR()
		const URL = 'pages/suppliers/products/forms/registration.html'
		const id = window.bms.default.state.supplier.cur.id
		const catId = window.bms.default.state.supplier.products.cur.data.id

		return XHR.request({method:'GET',url:URL}).then(res=>{
			document.getElementById('modal-product-body').innerHTML=res
			setTimeout(()=>{
				//remove cancel
				document.getElementById('modal-dialog-close-button').addEventListener('click',()=>{
					PopupInstance.closeAll()
				})

				//remove cont.
				document.getElementById('modal-dialog-add-product-button').addEventListener('click',()=>{
					window.bms.default.spinner.show()

					let prodNameTextField = document.querySelector('form[name="product-registration-form"] input#name')
					let prodDescTextField = document.querySelector('form[name="product-registration-form"] textarea#description')

					let data = {
						name:prodNameTextField.value,
						description:prodDescTextField.value,
						id:catId
					}

					if(!prodNameTextField.value.length>2) alert('Product name must be more than 2 characters long')



					Prod.register(data).then((json)=>{
						var parsedJSON=JSON.parse(json)
						var parsedData=parsedJSON.data



						if(parsedData){
							let target = document.querySelector('.product-table tbody')


							target.innerHTML+=`
								<tr>
									<td>
										<details>
											<summary><a href="#/suppliers/${id}/products/${parsedData}">${data.name}</a></summary>
										</details>
									</td>
									<td></td>
									<td></td>
								</tr>
							`	
						}
						
						//process XHR HERE
						window.bms.default.spinner.hide()
						PopupInstance.closeAll()
	

					}).catch((err)=>{
						alert('Oops something went wrong!Please try again later.')
					})
				})
			})
		}).catch(e=>{})
}

const getProductInfo=(id)=>{
	return new Promise((resolve,reject)=>{
		Prod.view(id).then((json)=>{
			var parsedData=JSON.parse(json)
			var data=parsedData.data

			//save to state as currently selected account
			if(!window.bms.default.state.product.cur) window.bms.default.state.product.cur={}
			window.bms.default.state.product.cur.data=data[0]
		


			resolve(data[0])
		})
	})
}

const loadRemoveProductModal=()=>{
		

		const XHR=new window.bms.exports.XHR()
			const URL='pages/suppliers/modal/remove.html'
			const id=window.bms.default.state.supplier.cur.id

			return XHR.request({method:'GET',url:URL}).then(res=>{
				let modalTarget=document.getElementById('modal-product-body')
				modalTarget.innerHTML=res

				setTimeout(()=>{
					window.bms.default.scriptLoader(modalTarget)
				},50)

				setTimeout(()=>{
					//remove cancel
					document.getElementById('modal-dialog-close-button').addEventListener('click',()=>{
						
						PopupInstance.closeAll()
					})
					//copy methods
					
					document.getElementById('modal-dialog-remove-button').addEventListener('click',removeProduct)
				})
			}).catch(e=>{})

}

const removeProduct=()=>{
	let id=window.bms.default.state.product.cur.data.id

	window.bms.default.spinner.show()

	let data = {id:id,action:'remove'}
	Prod.remove(data).then((json)=>{

		var parsedData=JSON.parse(json)
		var data=parsedData.data

		if(data==1){
			document.querySelector(`.product-profile-container`).innerHTML='DELETED'
		}else{
			alert('Oops!Something went wrong.Please try again later.')
		}

		//process XHR HERE
		window.bms.default.spinner.hide()
		PopupInstance.closeAll()
		

	}).catch((err)=>{
		alert('Oops something went wrong!Please try again later.')

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

				let prodCreateBtn = document.createElement('button')
				prodCreateBtn.classList.add('btn','btn-sm','btn-secondary')
				prodCreateBtn.setAttribute('data-target','#product-modal')
				prodCreateBtn.setAttribute('data-popup-toggle','open')
				prodCreateBtn.textContent = 'add +'
				prodCreateBtn.addEventListener('click',loadProductRegistrationModal)

				if(data[0]){
					//save to state
					if(!window.bms.default.state.supplier.products) window.bms.default.state.supplier.products = {}
					if(!window.bms.default.state.supplier.products.cur) window.bms.default.state.supplier.products.cur = {}
					if(!window.bms.default.state.supplier.products.cur.data) window.bms.default.state.supplier.products.cur.data = {}
					
					window.bms.default.state.supplier.products.cur.data = data[0]
					//DOM Update	
					data = data[0]
					target.innerHTML=`
						<h3>${data.name} <span class="product-create-button-section"></span></h3>
						<p>${data.description}</p>

						<div class="row product-table-section"></div>
					`
					document.querySelector('.product-create-button-section').append(prodCreateBtn)	
				}

				getProducts(params.cid)
				window.bms.default.spinner.hide()
				PopupInstance = new PopupES()

			})
	},
	'/suppliers/:id/products/:pid':(params)=>{ 

		prodInit(params);
		

		window.bms.default.spinner.show()
		window.bms.default.changeDisplay(['.product-container','.category-profile-container'],'none')
		window.bms.default.changeDisplay(['.product-profile-container'],'block')

		let target = document.querySelector('.product-profile-container')

		//delete button
		let delProdBtn = document.createElement('button')
		delProdBtn.classList.add('btn','btn-sm','btn-danger','product-delete-modal-button')
		delProdBtn.setAttribute('data-target','#product-modal')
		delProdBtn.setAttribute('data-popup-toggle','open')
		delProdBtn.textContent = '- Delete'
		delProdBtn.addEventListener('click',loadRemoveProductModal)

		getProductInfo(params.pid).then(data=>{
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
		
	}
}).resolve()

