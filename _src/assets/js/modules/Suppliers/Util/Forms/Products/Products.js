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


	removeProduct(e){
		
		window.bms.default.spinner.show()
			//if both is not present, not item is selected or no button is clicked
			if((!e.target.currentId)&&(!window.bms.default.state.product.cur)){
				alert('Unable to remove this item.Please try again later')
				window.bms.default.spinner.hide()
				return 0
			}
			//currentId is not present for menu
			if(!e.target.currentId){
				this.currentId = window.bms.default.state.product.cur.selected	
			}else{
				//must always return an array
				this.currentId = [e.target.currentId]
			} 
			let data = {id:this.currentId,action:'remove'}

			//remove
			Prod.remove(data).then((json)=>{
				var parsedData=JSON.parse(json)
				var res=parsedData.data

				if(res==1){

					for(let x=0;x<data.id.length;x++){
						this.removeFromList(data.id[x])	
					}
					
				
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



	changeCheckBox(){
		
		let id = this.currentId

		if(!window.bms.default.state.product.cur) window.bms.default.state.product.cur={}
		if(!window.bms.default.state.product.cur.selected) window.bms.default.state.product.cur.selected=[]

		if(this.checked){
			window.bms.default.state.product.cur.selected.push(id)
		}else{
			window.bms.default.state.product.cur.selected.splice(window.bms.default.state.product.cur.selected.indexOf(id),1)	
		}

		
		
	}

	changeCheckBoxAll(){
		let checkboxes = document.querySelectorAll('.product-checkbox')
		checkboxes.forEach((el,index)=>{
			if(this.checked){
				if(!el.checked) el.click()
			}else{
				if(el.checked) el.click()
			}
		})
		//console.log(window.bms.default.state.product.cur.selected)
	}
	prodSubmitMenu(){
		let action = document.querySelector('.prod-menu-action')
		if(action.value=='delete'){

			this.loadRemoveProductModal()	
		}
	}

	removeFromList(id){
		//remove in list
		let targ = document.querySelectorAll(`.products-${id}`)
		targ.forEach((el,index)=>{
			el.remove()
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
										
					<div class="product-container">
						<!--<div class="row col">
							<div class="col-lg-1"><i class="material-icons">search</i></div>
							<div class="col-lg-11"><input type="text" placeholder="find" class="form-control"></div>
							<br/><br/>

						</div>-->
						<div class="product-table-section-main" style="margin-top:20px;">
							<h3>Products <span class="header-circle"><i class="material-icons md-24">add_shopping_cart</i></span>
								&emsp;&emsp;<small style="font-size:12px;">
									<a class="active all" href="#/suppliers/${params.id}/products"><i class="material-icons md-18">local_mall</i> All</a>
									&emsp;<a class="categories" href="#/suppliers/${params.id}/products/tabs/categories">Categories</a>
								</small>
							</h3>
							
								

							
						</div>
					</div>
					<div class="category-container hide">
						<div class="category-menu-section"  style="padding-top:20px;"></div>
					</div>
					<div class="category-profile-container" style="padding-top:20px;"></div>
					<div class="product-profile-container"  style="padding-top:20px;"></div>
					<div class="product-registration-container"  style="padding-top:20px;"></div>
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
										
										<br/>
										<small><p><b>Description :</b> ${data.description}</p></small>
									</details>
									</td>
									<td style="min-width:100px;" class="price-section"></td>
									<td></td>
								</tr>
							`

							target.innerHTML+=htm	
						}
						
						//this.PopupInstance.closeAll()
						document.getElementById('product-modal').close()
						//process XHR HERE
						window.bms.default.spinner.hide()

						window.location.reload(true);
	

					}).catch((err)=>{
						console.log(err)
						alert('Oops something went wrong!Please try again later.')
					})
				})
			})
		}).catch(e=>{})
	}

	loadRemoveProductModal(e){
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
						
						//PopupInstance.closeAll()
						document.getElementById('product-modal').close()
					})




					let remBtn = document.getElementById('modal-dialog-remove-button')

					//this is present only if function was attached via addEventListener
					if(e) if(e.target.currentId) remBtn.currentId = e.target.currentId

					let a = Object.assign({ __proto__: this.__proto__ }, this)
					remBtn.addEventListener('click',this.removeProduct.bind(a))
				})
			}).catch(e=>{})

	}

}