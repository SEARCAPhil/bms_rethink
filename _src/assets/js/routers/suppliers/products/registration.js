import Categories from '../../../modules/Suppliers/Components/Products/Categories/Categories.js'
import Products from '../../../modules/Suppliers/Components/Products/Products.js'
import Specifications from '../../../modules/Suppliers/Components/Products/Specs/Specs.js'
import ProdUtilities from '../../../modules/Suppliers/Util/Forms/Products/Products.js'
import PopupES from '../../../Components/PopupES/PopupES.js'

const Cat=new Categories()
const Prod=new Products()
const Specs=new Specifications()
const ProdUtil=new ProdUtilities()

//window.bms.exports.PopupEs=PopupEs
const XHR=new window.bms.exports.XHR()
const appRoute=new window.bms.exports.Router('http://localhost/bms_rethink/www/',true)

let PopupInstance

const loadRegistration=()=>{
	return new Promise((resolve,reject)=>{
		XHR.request({url:'./pages/suppliers/products/forms/specs.html',method:'GET'}).then((data)=>{
			var el=document.querySelector('.product-registration-container')

			el.innerHTML=data

			setTimeout(()=>{
				window.bms.default.scriptLoader(el)
			},100)

			resolve(data)
		})
	}) 
	
}

const saveSpecsName=(e)=>{
	//enter
	if(e.target.type=='textarea'){
		if(!e.shiftKey) return 0;
	}
	
	if(e.keyCode==13){
		window.bms.default.spinner.show()

		//randowm ID
		let randomID = e.target.getAttribute('data-rand')
		let txtFields = e.target.parentNode.parentNode.querySelectorAll(`[data-rand="${randomID}"]`)

		let specsName , specsVal

		txtFields.forEach((el,index)=>{
			el.getAttribute('name')=='specs-name'?(specsName=el.value):(specsVal=el.value)
							
		})

		let id = window.bms.default.state.product.cur.data.id


		let specsId = e.target.getAttribute('data-specs-id')

		//update product specs if specsid is present
		if(specsId){
			
			
			Specs.update({id:specsId,name:specsName,value:specsVal,action:'update'}).then(json=>{

				var parsedData=JSON.parse(json)
				var data=parsedData.data

				if(data!=1){
					alert('Unable to proces request.Please try again later.')
					return 0;
				}

				window.bms.default.spinner.hide()
			})

			
		}else{
			//Create
			Specs.add({id:id,name:specsName,value:specsVal,action:'create'}).then(json=>{

				var parsedData=JSON.parse(json)
				var data=parsedData.data

				if(data<1){
					alert('Unable to proces request.Please try again later.')
				}else{
					//add attr
					txtFields.forEach((el,index)=>{
						el.setAttribute('data-specs-id',data)
					})
				}

				window.bms.default.spinner.hide()
			}).catch(e=>{
				alert('Unable to proces request.Please try again later.')
				window.bms.default.spinner.hide()
			})
		}

		
	}
}

const addInputField=()=>{

	let randomID = Math.random()

	let txtField = document.createElement('input')
	txtField.classList.add('specs-name','form-control',randomID)
	txtField.setAttribute('name','specs-name','specs-field')
	txtField.setAttribute('autofocus','')
	txtField.setAttribute('data-rand',randomID)

	//txtField.removeEventListener('keyup',saveSpecsName)
	//txtField.addEventListener('keyup',saveSpecsName)



	let txtFieldSpecsValue = document.createElement('input')
	txtFieldSpecsValue.classList.add('specs-name','form-control',randomID)
	txtFieldSpecsValue.setAttribute('name','specs-value','specs-field')
	txtFieldSpecsValue.setAttribute('autofocus','')
	txtFieldSpecsValue.setAttribute('data-rand',randomID)

	//txtFieldSpecsValue.removeEventListener('keyup',saveSpecsName)
	//txtFieldSpecsValue.addEventListener('keyup',saveSpecsName)

	let specsSection = document.createElement('span')
	specsSection.classList.add('row')
	specsSection.innerHTML = `
		<div class="col-lg-4 col-md-4 specs-name-section"></div>
		<div class="col-lg-7 col-md-7 specs-value-section"></div>
		 <div class="col-lg-1 col-md-1">
			<div style="padding:5px;float:left;" class="remove-input-field-button" data-rand-parent="${randomID}" data-target="#product-modal" data-popup-toggle="open">-</div>
			<div style="padding:5px;float:left;" class="add-input-field-button" data-rand-parent="${randomID}">+</div>
		</div>
	`
	specsSection.querySelector('.specs-name-section').append(txtField)
	specsSection.querySelector('.specs-value-section').append(txtFieldSpecsValue)

		document.querySelector('.specs-form-section').append(specsSection)
		bindAddInputFieldBtn()
		bindRemoveInputFieldBtn()
		
}


const removeInputField=(e)=>{

	let targ = (e.target.parentNode.parentNode.querySelector(`[data-rand="${e.target.getAttribute('data-rand-parent')}"]`))
	//console.log(e.target.parentNode.parentNode.remove())

	if(targ){
		const id = targ.getAttribute('data-specs-id')

		const URL = 'pages/suppliers/modal/remove.html'

		XHR.request({method:'GET',url:URL}).then(res=>{
			document.getElementById('modal-product-body').innerHTML=res
			setTimeout(()=>{
				//remove cancel
				document.getElementById('modal-dialog-close-button').addEventListener('click',()=>{
					//this.PopupInstance.closeAll()
					document.getElementById('product-modal').close()
				})

				//remove cont.
				document.getElementById('modal-dialog-remove-button').addEventListener('click',()=>{
					window.bms.default.spinner.show()

					Specs.remove({id:id,action:'remove'}).then(json=>{
						var parsedData=JSON.parse(json)
						var data=parsedData.data

						if(data==1){
							targ.parentNode.parentNode.remove()
						}else{
							alert('Sorry!Unable to delete this item.Please try again later.')
							
						}

						document.getElementById('product-modal').close()
						window.bms.default.spinner.hide()
					}).catch(e=>{
						alert('Sorry!Unable to delete this item.Please try again later.')
						window.bms.default.spinner.hide()
					})
				})
			})
		})

	}
}

const bindAddInputFieldBtn=()=>{
	let targ = document.querySelectorAll('.add-input-field-button')
	targ.forEach((el,index)=>{ 
		el.removeEventListener('click',addInputField)
		el.addEventListener('click',addInputField)
	})
}

const bindRemoveInputFieldBtn=()=>{
	let targ = document.querySelectorAll('.remove-input-field-button')
	targ.forEach((el,index)=>{ 
		el.removeEventListener('click',removeInputField)
		el.addEventListener('click',removeInputField)
	})
}

const changeProductName=(e)=>{
	if(e.keyCode==13){
		window.bms.default.spinner.show()
		let id = window.bms.default.state.product.cur.data.id
		let name = window.bms.default.state.product.cur.data.name

		Prod.update({id:id,name:e.target.value,action:'update'}).then(json=>{

			var parsedData=JSON.parse(json)
			var data=parsedData.data

			if(data<1){
				alert('Unable to proces request.Please try again later.')
			}

			window.bms.default.spinner.hide()
		})
	}
}


const loadProductInit=(params)=>{

	window.bms.default.changeDisplay(['route[name="/suppliers/products"]'],'block')
	window.bms.default.changeDisplay(['route[name="/suppliers/about"]','route[name="/suppliers/settings"]','route[name="/suppliers/logs"]','route[name="/suppliers/logs"]','route[name="/suppliers/accounts"]'],'none')


	let page = 1
	ProdUtil.loadProductSection(params).then(()=>{
		window.bms.default.changeDisplay(['.product-container','.category-profile-container','.product-registration-container'],'none')
		window.bms.default.changeDisplay(['.product-registration-container'],'block')

		loadRegistration().then(()=>{
			ProdUtil.getInfo(params.pid).then(data=>{
				
				window.bms.default.spinner.hide()

				let prodNameTxtField = document.querySelector('form[name="product-registration-update-form"] input#name')
				let prodCurTxtField = document.querySelector('form[name="product-registration-update-form"] input#currency')
				let prodPriceTxtField = document.querySelector('form[name="product-registration-update-form"] input#price')

				//change product name
				prodNameTxtField.addEventListener('keyup',changeProductName)

				if(data.id){
					
					prodNameTxtField.value = data.name
				}

				if(data.prices[0]){
					prodCurTxtField.value = data.prices[0].currency
					prodPriceTxtField.value = data.prices[0].amount
				}

				let specs = ''

				for(var x = 0; x < data.specs.length; x++){

					//random specs unique key
					let rand = Math.random()

					specs+='<span class="row">'

					specs+=`
					    <div class="col-lg-4 col-md-4">
					    	<input type="text" name="specs-name" data-rand="${rand}" data-specs-id="${data.specs[x].id}" placeholder="Name" class="form-control specs-name specs-field" value="${data.specs[x].name}">
					    </div>
					   `
					if(data.specs[x].value.length<90){
						specs+=` <div class="col-lg-7 col-md-7">
					    	<input type="text" name="specs-value" data-rand="${rand}" data-specs-id="${data.specs[x].id}" class="form-control specs-field" placeholder="Value" value="${data.specs[x].value}">
					    </div>`	
					}else{
						specs+=`
							 <div class="col-lg-7 col-md-7">
								<textarea class="form-control specs-field" data-rand="${rand}" name="specs-value" rows="7" data-specs-id="${data.specs[x].id}">${data.specs[x].value}</textarea>
							</div>
						`
					}

					specs+=`
							 <div class="col-lg-1 col-md-1">
								<div style="padding:5px;float:left;" class="remove-input-field-button" data-rand-parent="${rand}" data-target="#product-modal" data-popup-toggle="open">-</div>
								<div style="padding:5px;float:left;" class="add-input-field-button" data-rand-parent="${rand}" >+</div>
							</div>
						`
					specs+='</span>'
				}
				

				document.querySelector('.specs-form-section').innerHTML+=specs
				
				PopupInstance = new PopupES()

				bindAddInputFieldBtn()
				bindRemoveInputFieldBtn()

				//respond to type
				document.querySelectorAll('.specs-form-section').forEach((el,index)=>{
					el.removeEventListener('keyup',saveSpecsName)
					el.addEventListener('keyup',saveSpecsName)
				})

				
					
				
			})	
		})
	})
}




appRoute.on({
 	'/*':()=>{
 		//required
 	},
	'/suppliers/:id/products/:pid/registration/update':(params)=>{
		loadProductInit(params)
	}
}).resolve()

