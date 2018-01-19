import Products from '../../../Components/Products/Products.js'
import PopupES from '../../../../../Components/PopupES/PopupES.js'


const Prod=new Products()
const XHR=new window.bms.exports.XHR()


export default class{
	constructor(){
		this.PopupInstance = new PopupES()
	}

	getInfo(id){
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


	removeProduct(){
		let id=window.bms.default.state.product.cur.data.id

		window.bms.default.spinner.show()

		let data = {id:id,action:'remove'}

		//remove
		Prod.remove(data).then((json)=>{
			var parsedData=JSON.parse(json)
			var data=parsedData.data

			if(data==1){
				document.querySelector(`.product-profile-container`).innerHTML=`
					<center style="margin-top:100px;">
						<i class="material-icons md-48">phonelink_erase</i>
						<h4 class="text-danger">Access forbidden</h5>
						<p>This product has been deleted</p>
					</center>
				`
			}else{
				alert('Oops!Something went wrong.Please try again later.')
			}

			//process XHR HERE
			window.bms.default.spinner.hide()
			document.getElementById('product-modal').close()
			

		}).catch((err)=>{
			alert('Oops something went wrong!Please try again later.')
		})
	}

	loadProductSection(params={}){  
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
					<div class="product-main-tabs">
						<ul class="nav nav-tabs">
						  <li class="nav-item">
						    <a class="nav-link active all" href="#/suppliers/${params.id}/products"><i class="material-icons md-18">local_mall</i> All</a>
						  </li>
						  <li class="nav-item">
						    <a class="nav-link categories" href="#/suppliers/${params.id}/products/tabs/categories">Categories</a>
						  </li>
						</ul>
					</div>
					
					
					<div class="product-container" style="padding-top:20px;">
						<!--<div class="row col">
							<div class="col-lg-1"><i class="material-icons">search</i></div>
							<div class="col-lg-11"><input type="text" placeholder="find" class="form-control"></div>
							<br/><br/>

						</div>-->
						<div class="product-table-section-main" style="margin-top:50px;">
							<h3>Products <span style="float:left;width:33px;height:33px;border-radius:50%;text-align:center;background:#009688;overflow:hidden;margin-left:10px;margin-right:10px;color:rgb(255,255,255);cursor:pointer;valign:bottom;padding:1px;"><i class="material-icons md-24">add_shopping_cart</i></span></h3>
						</div>
					</div>
					<div class="category-container hide">
						<div class="category-menu-section"  style="padding-top:20px;"></div>
					</div>
					<div class="category-profile-container" style="padding-top:20px;"></div>
					<div class="product-profile-container"  style="padding-top:20px;"></div>
				</div>
			</section>`

			let el=document.querySelector('route[name="/suppliers/products"]')
			el.innerHTML=html

			resolve(el)
		})
	}

	loadProductRegistrationModal(){

		const URL = 'pages/suppliers/products/forms/registration.html'
		const id = window.bms.default.state.supplier.cur.id


		return XHR.request({method:'GET',url:URL}).then(res=>{
			document.getElementById('modal-product-body').innerHTML=res
			setTimeout(()=>{
				//remove cancel
				document.getElementById('modal-dialog-close-button').addEventListener('click',()=>{
					//this.PopupInstance.closeAll()
					document.getElementById('product-modal').close()
				})

				//remove cont.
				document.getElementById('modal-dialog-add-product-button').addEventListener('click',()=>{
					window.bms.default.spinner.show()

					let prodNameTextField = document.querySelector('form[name="product-registration-form"] input#name')
					let prodDescTextField = document.querySelector('form[name="product-registration-form"] textarea#description')
					let prodCurrencyTextField = document.querySelector('form[name="product-registration-form"] input#currency')
					let prodPriceTextField = document.querySelector('form[name="product-registration-form"] input#price')

					let data = {
						name:prodNameTextField.value,
						description:prodDescTextField.value,
						price:{ 
							currency: prodCurrencyTextField.value,
							amount: prodPriceTextField.value
						},
						id:id
					}

					if(!prodNameTextField.value.length>2) alert('Product name must be more than 2 characters long')



					Prod.register(data).then((json)=>{
						var parsedJSON=JSON.parse(json)
						var parsedData=parsedJSON.data



						if(parsedData){
							let target = document.querySelector('.product-table tbody')


							let htm=`
								<tr>
									<td>
										<details open>
											<summary><a href="#/suppliers/${id}/products/${parsedData}">${data.name}</a></summary>
										</details>
										<br/>
										<small><p><b>Description :</b> ${data.description}</p></small>
									</td>
									<td></td>
									<td></td>
								</tr>
							`

							target.innerHTML+=htm	
						}
						
						//this.PopupInstance.closeAll()
						document.getElementById('product-modal').close()
						//process XHR HERE
						window.bms.default.spinner.hide()

	

					}).catch((err)=>{
						console.log(err)
						alert('Oops something went wrong!Please try again later.')
					})
				})
			})
		}).catch(e=>{})
	}


	loadRemoveProductModal(){
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
						
						this.PopupInstance.closeAll()
					})

					//copy methods
					let a = Object.assign({ __proto__: this.__proto__ }, this)
					document.getElementById('modal-dialog-remove-button').addEventListener('click',this.removeProduct.bind(a))
				})
			}).catch(e=>{})

	}

}