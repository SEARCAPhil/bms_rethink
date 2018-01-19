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


const changeSpecsNameToTextField=(e)=>{

	let target = e.target
	let val = target.innerText
	let pid = target.getAttribute('data-product-id')

	target.innerHTML=`
		<input type="text" class="specs-name-text-field form-control" value="${val}">
	`
	appendSaveBtn(pid)
}

const changeSpecsValueToTextArea=(e)=>{
	console.log(e)
	let target = e.target
	let val = target.innerText

	target.innerHTML=`
		<textarea class="specs-value-textarea-field form-control" rows="5" >${val}</textarea>
	`
	

}

const appendSaveBtn=(pid)=>{

	let targ = document.querySelector(`.product-table > tbody > tr > td[data-list="${pid}"]`)
	
	//save button
	let specsSaveBtn = document.createElement('button')
	specsSaveBtn.classList.add('btn','btn-sm','btn-light','float-right')
	specsSaveBtn.innerHTML = `<i class="material-icons md-18 text-success">check</i> SAVE`

	//save button
	let specsSaveBtnCancel = document.createElement('button')
	specsSaveBtnCancel.classList.add('btn','btn-sm','btn-light','float-right')
	specsSaveBtnCancel.innerHTML = `<i class="material-icons md-18 text-danger">cancel</i> Cancel`

	targ.append(specsSaveBtn)
	targ.append(specsSaveBtnCancel)


}


const loadProductInit=(params)=>{

	window.bms.default.changeDisplay(['route[name="/suppliers/products"]'],'block')
	window.bms.default.changeDisplay(['route[name="/suppliers/about"]','route[name="/suppliers/settings"]','route[name="/suppliers/logs"]','route[name="/suppliers/logs"]','route[name="/suppliers/accounts"]'],'none')


	let page = 1
	ProdUtil.loadProductSection(params).then(()=>{
		Prod.lists({id:params.id}).then(json=>{
			var parsedData=JSON.parse(json)
			var data=parsedData.data

			//create button
			let prodCreateBtn = document.createElement('button')

			prodCreateBtn.classList.add('btn','btn-sm','btn-dark')
			prodCreateBtn.setAttribute('data-target','#product-modal')
			prodCreateBtn.setAttribute('data-popup-toggle','open')
			prodCreateBtn.textContent = 'add +'

			prodCreateBtn.addEventListener('click',ProdUtil.loadProductRegistrationModal)

			document.querySelector('.product-table-section-main').innerHTML+=`
				<small class="row col" style="margin-bottom:15px;">
					<b class="text-muted">&emsp;Options :&emsp;</b>
					<span><input type="checkbox"> Select / Deselect All&emsp;</span>
					<select>
						<option>Delete</option>
						<option>Move to category</option>
					</select> &emsp;
					<button class="btn btn-sm">Submit</button>
					
				</small>
			`
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

			if(data.length>0&&page==1){
				
				//DOM Insert
				setTimeout(function() {
					let target = document.querySelector('.product-table tbody')
					

					for(let x=0; x<data.length;x++){

						let prices = ''
						//Prices
						for (let z = 0; z < data[x].prices.length; z++){
							prices+=`<small><p class="text-danger"><b>${data[x].prices[z].currency} ${data[x].prices[z].amount}</b> </p></small>`

							//only used the latest and previous price
							if(z==1){
								prices+=`<small><p class="text-muted"><strike>${data[x].prices[z].currency} ${data[x].prices[z].amount}</strike> </p></small>`	
								return 0;
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
							specsNameSection.innerHTML = `
								${data[x].specs[y].name}
							`
							specsNameSection.setAttribute('data-list',data[x].specs[y].id)
							specsNameSection.setAttribute('data-product-id',data[x].id)
							specsNameSection.addEventListener('dblclick',changeSpecsNameToTextField)	

							//specs description
							let specsValueSection = document.createElement('span')
							specsValueSection.classList.add('specs-value-section')
							specsValueSection.innerHTML = `${data[x].specs[y].value}`

							specsValueSection.addEventListener('dblclick',changeSpecsValueToTextArea)
					

							
							specsSection.append(specsNameSection)
							specsSection.append(specsValueSection)
						}

						let htm = document.createElement('tr')
						htm.innerHTML = `
							<tr>
								<td colspan="2" data-list="${data[x].id}" style="position:relative;">
									<details ${(x<2?'open':'')}>
										<summary>
											<input type="checkbox" name="products"> <a href="#/suppliers/${params.id}/products/${data[x].id}">${data[x].name}</a>
										</summary>
										<br/>
										<button class="btn btn-dark btn-xs"><i class="material-icons md-12" style="line-height:0;">mode_edit</i></button> <button class="btn btn-danger btn-xs">-</button>
										<br/>
									</details>

								</td>
								<td style="min-width:100px;">${prices}</td>
							</tr>
						`
						htm.children[0].children[0].append(specsSection)
						target.append(htm)



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

				//Prices
				let prices = ''
				//Prices
				for (let z = 0; z < data.prices.length; z++){
					prices+=`<p class="text-danger"><b>${data.prices[z].currency} ${data.prices[z].amount}</b> </p>`

					//only used the latest and previous price
					if(z==1){
						prices+=`<small><p class="text-muted"><strike>${data.prices.currency} ${data.prices.amount}</strike> </p></small>`	
						return 0;
					}
				}

				//DOM insert
				target.innerHTML=`
					<h3>${data.name}</h3>
					${prices}
					<span class="product-menu-section"></span>
					
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

