import Categories from '../../../modules/Suppliers/Components/Products/Categories/Categories.js'
import Products from '../../../modules/Suppliers/Components/Products/Products.js'
import ProdUtilities from '../../../modules/Suppliers/Util/Forms/Products/Products.js'
import PopupES from '../../../Components/PopupES/PopupES.js'

const Cat=new Categories()
const Prod=new Products()
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

const addInputField=()=>{
	let specs=`<span class="row"><div class="col-lg-4 col-md-4">
		    	<input type="text" name="currency" id="currency" placeholder="Name" class="form-control">
		    </div>
			<div class="col-lg-7 col-md-7">
			    <input type="text" name="price" id="price" class="form-control" placeholder="Value">
			</div>
			 <div class="col-lg-1 col-md-1">
				<div style="padding:5px;float:left;" class="remove-input-field-button">-</div>
				<div style="padding:5px;float:left;" class="add-input-field-button">+</div>
			</div></span>
				`

		document.querySelector('.specs-form-section').innerHTML+=specs
		bindAddInputFieldBtn()
		bindRemoveInputFieldBtn()
		
}


const removeInputField=(e)=>{
	console.log(e.target.parentNode.parentNode.remove())	
}

const bindAddInputFieldBtn=()=>{
	let targ = document.querySelectorAll('.add-input-field-button')
	targ.forEach((el,index)=>{ 
		el.addEventListener('click',addInputField)
	})
}

const bindRemoveInputFieldBtn=()=>{
	let targ = document.querySelectorAll('.remove-input-field-button')
	targ.forEach((el,index)=>{ 
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

				let specs = '<span class="row">'
				for(var x = 0; x < data.specs.length; x++){
					specs+=`
					    <div class="col-lg-4 col-md-4">
					    	<input type="text" name="currency" id="currency" placeholder="Name" class="form-control" value="${data.specs[x].name}">
					    </div>
					   `
					if(data.specs[x].value.length<90){
						specs+=` <div class="col-lg-7 col-md-7">
					    	<input type="text" name="price" id="price" class="form-control" placeholder="Value" value="${data.specs[x].value}">
					    </div>`	
					}else{
						specs+=`
							 <div class="col-lg-7 col-md-7">
								<textarea class="form-control" rows="7">${data.specs[x].value}</textarea>
							</div>
						`
					}

					specs+=`
							 <div class="col-lg-1 col-md-1">
								<div style="padding:5px;float:left;" class="remove-input-field-button">-</div>
								<div style="padding:5px;float:left;" class="add-input-field-button">+</div>
							</div>
						`
				}
				
				specs+='</span>'
				document.querySelector('.specs-form-section').innerHTML+=specs
				bindAddInputFieldBtn()
				bindRemoveInputFieldBtn()
				
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

