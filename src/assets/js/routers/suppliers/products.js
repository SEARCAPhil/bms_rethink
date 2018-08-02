import Categories from '../../modules/Suppliers/Components/Products/Categories/Categories.js'
import Products from '../../modules/Suppliers/Components/Products/Products.js'
import Prices from '../../modules/Suppliers/Components/Products/Price/Price.js'
import ProdUtilities from '../../modules/Suppliers/Util/Forms/Products/Products.js'
import PopupES from '../../components/PopupES/PopupES.js'

const Cat=new Categories()
const Prod=new Products()
const Price=new Prices()
const ProdUtil=new ProdUtilities()

//window.bms.exports.PopupEs=PopupEs
const XHR=new window.bms.exports.XHR()
const appRoute=new window.bms.exports.Router('http://localhost/bms_rethink/www/',true)

let PopupInstance


const changeSpecsNameToTextField=(e)=>{

	let target = e.target
	let val = target.innerText
	let pid = target.getAttribute('data-product-id')
	console.log(target)

	let targClone = target.cloneNode(true)

	let txtField = document.createElement('input')
	txtField.classList.add('specs-name-text-field','form-control')
	txtField.setAttribute('name',target.getAttribute('name'))
	txtField.setAttribute('autofocus','')
	txtField.setAttribute('data-product-id',pid)
	txtField.value = val
	
	txtField.addEventListener('keyup',(e)=>{
		//escape
		if(e.keyCode==27){
			txtField.replaceWith(targClone)
		}
		//enter
		if(e.keyCode==13){
			window.bms.default.spinner.show()
			Price.update({id:e.target.getAttribute('data-product-id'),name:e.target.getAttribute('name'),value:e.target.value,action:'update'}).then(json=>{
				
				var parsedData=JSON.parse(json)
				var data=parsedData.data

				let oldValue = targClone.innerText

				targClone.innerHTML = e.target.value
				txtField.replaceWith(targClone)

				//error
				//revert 
				if(data<1){
					alert('Unable to process request. Please try again later')
					targClone.innerText =	oldValue
				}

				if(data>1){
					document.querySelectorAll('.product-price-span').forEach((el,index)=>{
						el.setAttribute('data-product-id',data)	
					})
				}

			}).then(()=>{
				window.bms.default.spinner.hide()
			})
		}
	})

	if(val.length>0) target.replaceWith(txtField)
}



const loadProductInit=(params)=>{

	window.bms.default.changeDisplay(['route[name="/suppliers/products"]'],'block')
	window.bms.default.changeDisplay(['route[name="/suppliers/about"]','route[name="/suppliers/settings"]','route[name="/suppliers/logs"]','route[name="/suppliers/logs"]','route[name="/suppliers/accounts"]','.company-name-section'],'none')


	let page = 1
	ProdUtil.loadProductSection(params).then(()=>{
		Prod.lists({id:params.id}).then(json=>{
			var parsedData=JSON.parse(json)
			var data=parsedData.data

			//create button
			let prodCreateBtn = document.createElement('button')

			prodCreateBtn.classList.add('btn','btn-xs','btn-dark')
			prodCreateBtn.setAttribute('data-target','#product-modal')
			prodCreateBtn.setAttribute('data-popup-toggle','open')
			prodCreateBtn.textContent = '+'

			prodCreateBtn.addEventListener('click',ProdUtil.loadProductRegistrationModal)

			//checkbox selector
			let optionsProductCheckBoxAll = document.createElement('input')
			optionsProductCheckBoxAll.type = 'checkbox'
			optionsProductCheckBoxAll.name = 'products'
			optionsProductCheckBoxAll.addEventListener('change',ProdUtil.changeCheckBoxAll)

			//submit button
			let submitProductMenuOptions = document.createElement('button')
			submitProductMenuOptions.classList.add('btn','btn-xs')
			submitProductMenuOptions.textContent = 'Go'
			submitProductMenuOptions.setAttribute('data-target','#product-modal')
			submitProductMenuOptions.setAttribute('data-popup-toggle','open')
			submitProductMenuOptions.addEventListener('click',ProdUtil.prodSubmitMenu.bind(ProdUtil))

			//menu option
			let prodMenuOptions = document.createElement('small')
			prodMenuOptions.classList.add('row','col')
			prodMenuOptions.style.marginBottom = '15px'
			prodMenuOptions.innerHTML=`

				<b class="text-muted">&emsp;Options :&emsp;</b>
					<span class="prod-menu-section"></span> Select / Deselect All&emsp;
					<select class="prod-menu-action">
						<option value="delete">Delete</option>
						<option value="move">Move to category</option>
					</select> &emsp;
					
					
			`
			prodMenuOptions.append(submitProductMenuOptions)
			//checkbox
			prodMenuOptions.querySelector('.prod-menu-section').append(optionsProductCheckBoxAll)


			//DOM Table
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
			document.querySelector('.product-table').parentNode.insertBefore(prodMenuOptions,document.querySelector('.product-table'))

			if(data.length>0&&page==1){
				
				//DOM Insert
				setTimeout(function() {
					let target = document.querySelector('.product-table tbody')
					

					for(let x=0; x<data.length;x++){

						let prices = document.createElement('p')
						//Prices
						for (let z = 0; z < data[x].prices.length; z++){
							//currency
					
							let curSec = document.createElement('span')
							curSec.classList.add('text-danger','product-currency-section')
							curSec.innerHTML = `<b class="product-price-span" data-product-id="${data[x].prices[z].id}" name="currency">${data[x].prices[z].currency}</b>`
							curSec.setAttribute('name','currency')
							curSec.setAttribute('data-product-id',data[x].prices[z].id)
							

							let amountSec = document.createElement('span')
							amountSec.classList.add('text-danger','product-amount-section')
							amountSec.innerHTML = `<span class="product-price-span" data-product-id="${data[x].prices[z].id}" name="amount">${data[x].prices[z].amount}</span>`
							amountSec.setAttribute('name','amount')
							amountSec.setAttribute('data-product-id',data[x].prices[z].id)


							//set new price btn
							let newPriceBtn = document.createElement('p')
							newPriceBtn.classList.add('text-muted')
							newPriceBtn.style.fontSize = "11px"
							newPriceBtn.style.float = "left"
							newPriceBtn.style.width = "100%"
							newPriceBtn.textContent = 'old price'

							//attach event listenser only for the latest price
							if(z==0){
								curSec.addEventListener('dblclick',changeSpecsNameToTextField)
								amountSec.addEventListener('dblclick',changeSpecsNameToTextField)
							}
							//only used the latest and previous price
							if(z==1){
								//prices+=`<small><p class="text-muted product-amount-section"><strike>${data[x].prices[z].currency} ${data[x].prices[z].amount}</strike> </p></small>`	
								//return 0;
								curSec.style.textDecoration = 'line-through'
								amountSec.style.textDecoration = 'line-through'

								curSec.style.fontSize = '11px'
								amountSec.style.fontSize = '11px'


								let breaker = document.createElement('br')
								prices.append(breaker)
								
							}

							//only show the recent and previous price
							if(z<2){
								prices.append(curSec)
								prices.append(amountSec)
								
							}
							
							//old price
							if(z==1){
								prices.append(newPriceBtn)
							}


							
						}
						
						
						let specsSection = document.createElement('small')
						specsSection.classList.add(`.specs-section-${data[x].id}`)


						//SPECIFICATIONS
						for(let y =0; y < data[x].specs.length; y++){
							//specs name
							let specsNameSection = document.createElement('span')
							specsNameSection.classList.add('specs-name-section')
							specsNameSection.style.fontWeight = 'bold'
							specsNameSection.innerHTML = `<br/>
								${data[x].specs[y].name}
							`
							specsNameSection.setAttribute('data-list',data[x].specs[y].id)
							specsNameSection.setAttribute('data-product-id',data[x].id)
								

							//specs description
							let specsValueSection = document.createElement('span')
							specsValueSection.classList.add('specs-value-section')
							specsValueSection.innerHTML = `${data[x].specs[y].value}`
							
							specsSection.append(specsNameSection)
							specsSection.append(specsValueSection)
						}

						//buttons
						let removeProductModalButton = document.createElement('button')
						removeProductModalButton.textContent = '-'
						removeProductModalButton.classList.add('btn', 'btn-danger', 'btn-xs')
						removeProductModalButton.setAttribute('data-target',"#product-modal")
						removeProductModalButton.setAttribute('data-popup-toggle',"open")
						removeProductModalButton.currentId = data[x].id
						removeProductModalButton.addEventListener('click',ProdUtil.loadRemoveProductModal.bind(ProdUtil))

						//checkbox
						let optionsProductCheckBox = document.createElement('input')
						optionsProductCheckBox.type = 'checkbox'
						optionsProductCheckBox.name = 'products'
						optionsProductCheckBox.classList.add('product-checkbox')
						optionsProductCheckBox.currentId = data[x].id
						optionsProductCheckBox.addEventListener('change',ProdUtil.changeCheckBox)

						let htm = document.createElement('tr')
						htm.classList.add(`products`,`products-${data[x].id}`)
						htm.innerHTML = `
							<tr>
								<td colspan="2" data-list="${data[x].id}" style="position:relative;">
									<details ${(x<1?'open':'')}>
										<summary>
											<a href="#/suppliers/${params.id}/products/${data[x].id}">${data[x].name}</a>
											<p><small><b>Category : </b> ${data[x].category?data[x].category:'N/A'}</small></p>
										</summary>
										<br/>
										<a href="#/suppliers/${params.id}/products/${data[x].id}/registration/update"><button class="btn btn-dark btn-xs"><i class="material-icons md-12" style="line-height:0;">mode_edit</i></button></a> 
									
										
									</details>

								</td>
								<td style="min-width:100px;" class="price-section"></td>
							</tr>
						`
						htm.querySelector('.price-section').append(prices)
						htm.querySelector('details > summary').prepend(optionsProductCheckBox)

						htm.children[0].children[0].append(removeProductModalButton)
						htm.children[0].children[0].append(specsSection)
						target.append(htm)
						PopupInstance = new PopupES()



						window.bms.default.spinner.hide()
					}

				}, 10);



				document.querySelector('.product-add-section').append(prodCreateBtn)

				PopupInstance = new PopupES()


			}else{
				window.bms.default.spinner.hide()
				//empty product list
				let target = document.querySelector('.product-table-section-main')

				target.innerHTML+=`
					<center style="margin-top:50px; product-table-main-empty">
						<p><i class="material-icons md-48 text-muted">shopping_basket</i></p>
						<h5>No Products</h5>
						<p>Add an item now to easily track your supply</p>
						<div class="product-add-section"></div>
					</center>
				`

				document.querySelector('.product-add-section').append(prodCreateBtn)
				PopupInstance = new PopupES()
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
			window.bms.default.changeDisplay(['.product-container','.category-profile-container','.company-name-section'],'none')

			ProdUtil.getInfo(params.pid).then(data=>{
				
				let target = document.querySelector('.product-profile-container')

				//delete button
				let delProdBtn = document.createElement('button')
				delProdBtn.classList.add('btn','btn-sm','btn-danger','product-delete-modal-button')
				delProdBtn.setAttribute('data-target','#product-modal')
				delProdBtn.setAttribute('data-popup-toggle','open')
				delProdBtn.textContent = '- Delete'
				delProdBtn.addEventListener('click',ProdUtil.loadRemoveProductModal.bind(ProdUtil))

				//Prices
				let prices = ''
				let oldPrice = 0
				//Prices
				for (let z = 0; z < (data.prices.length>1?2:data.prices.length); z++ ){
					
					
					//only used the latest and previous price
					if(z==1){
						prices+=`<small>
						<p class="text-muted"><strike>${data.prices[z].currency} ${data.prices[z].amount}</strike> 
						<button class="btn btn-danger btn-xs">${(((oldPrice-data.prices[z].amount)/oldPrice)*100).toFixed(2)} % </button></p>
						

						</small>`	
						break;
					}

					prices+=`<p class="text-danger"><b>${data.prices[z].currency} ${data.prices[z].amount}</b> </p>`
					oldPrice = data.prices[z].amount
				}

				//DOM insert
				target.innerHTML=`
					<h3>${data.name}</h3>
					${prices}
					<span class="product-menu-section"></span>
					<hr/>
					<div class="specs-section" style="margin-top:60px;"></div>
				`

				setTimeout(()=>{
					let specsSection = document.querySelector('.specs-section')
					let prodMenuSection = document.querySelector('.product-menu-section')

					//Menu
					//prodMenuSection.append(delProdBtn)

					//specs
					let specs = '<h3>Specifications <span class="header-circle"><i class="material-icons md-24">bookmark</i></span></h3><br/>'

					for(let y =0; y < data.specs.length; y++){
						specs+= `<p class="specs-section-p"><b>${data.specs[y].name} :</b> ${data.specs[y].value}</p>`
					}

					specsSection.innerHTML+=specs

					PopupInstance = new PopupES()

				},10)
				
				window.bms.default.spinner.hide()	
			})
		})
	}
}).resolve()

