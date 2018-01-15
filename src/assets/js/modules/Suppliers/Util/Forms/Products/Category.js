import CatComp from '../../../Components/Products/Categories/Categories.js'
import CatTemplate from '../../../Templates/Products/Categories/Categories.js'
import PopupES from '../../../../../Components/PopupES/PopupES.js'


const CatTemp=new CatTemplate()
const Cat=new CatComp()
const XHR=new window.bms.exports.XHR()


export default class{
	constructor(){
		this.PopupInstance = new PopupES()
	}
	addCategory(e){	

		//disable
		this.toggleButton(e.target,"disabled")

		//loading
		window.bms.default.spinner.show()

		let id=window.bms.default.state.supplier.cur.data.id

		var name=document.querySelector('form[name="category-registration-form"] input#name')
		var description=document.querySelector('form[name="category-registration-form"] textarea#description')
		
		

		//data
		var data={
			name:name.value,
			description:description.value,
			action:'create',
			id:id
		}


		Cat.register(data).then(json=>{
			var parsedJson=JSON.parse(json)

			if(parsedJson.data){
				this.showSuccessNotif(data)
			}else{
				this.showErrorNotif(data)	
			}
		
			//enable button
			setTimeout(()=>{
				this.toggleButton(e.target,"enabled")
				window.bms.default.spinner.hide()

				//hide modal
				document.querySelector('#product-modal').close()
			},500)

			
		})
	}


	loadCategorySection(){ 
		let el = document.querySelector('.product-menu-section')
		let btn = document.createElement('button')
		let a = Object.assign({ __proto__: this.__proto__ }, this)

		//buttons
		btn.classList.add("btn","btn-dark","btn-sm")
		btn.setAttribute('data-target','#product-modal')
		btn.setAttribute('data-popup-toggle','open')
		btn.textContent='category +'



		btn.addEventListener('click',this.loadCategoryModal.bind(a))
		
		el.append(btn)

		this.PopupInstance=new PopupES()
	}

	loadCategoryModal(e){ 
		return new Promise((resolve,reject)=>{
			XHR.request({url:'./pages/suppliers/products/forms/category.html',method:'GET'}).then((data)=>{
				var el=document.querySelector('#modal-product-body')
				el.innerHTML=data

				setTimeout(()=>{
					window.bms.default.scriptLoader(el)

					//remove cancel
					document.getElementById('modal-dialog-close-button').addEventListener('click',()=>{ 
						document.getElementById('product-modal').close()
					})

				},100)

				resolve(data)
			})
		}).then(()=>{

			let button = document.querySelector('#modal-dialog-add-category-button')
			let a = Object.assign({ __proto__: this.__proto__ }, this)
			button.addEventListener('click',this.addCategory.bind(a))
		}) 	
	}


	loadDeleteModal(e){

		const XHR=new window.bms.exports.XHR()
		const URL='pages/suppliers/modal/remove.html'
		const id=window.bms.default.state.supplier.cur.id
		
		const categoryId=e.target.getAttribute('data-category-id')

		return XHR.request({method:'GET',url:URL}).then(res=>{
			document.getElementById('modal-product-body').innerHTML=res
			setTimeout(()=>{
				//remove cancel
				document.getElementById('modal-dialog-close-button').addEventListener('click',()=>{
					this.PopupInstance.closeAll()
				})

				//remove cont.
				document.getElementById('modal-dialog-remove-button').addEventListener('click',()=>{
					window.bms.default.spinner.show()

					let data = {id:categoryId,action:'remove'}
					Cat.remove(data).then((json)=>{
						//process XHR HERE
					
						window.bms.default.spinner.hide()
						this.PopupInstance.closeAll()
						document.querySelector(`.category[data-list="${categoryId}"]`).remove()

					}).catch((err)=>{
						alert('Oops something went wrong!Please try again later.')
		
					})
					
				})
			})
		}).catch(e=>{})
	}


	loadUpdateInputField(e){
		let a = Object.assign({ __proto__: this.__proto__ }, this)
		//parent
		const categoryId = e.target.getAttribute('data-category-id')
		const parentDiv = document.querySelector(`.category[data-list="${categoryId}"]`)

		const descriptionEl = document.querySelector(`.category-description-${categoryId}`)
		const descriptionElValue = descriptionEl.innerText


		//textarea
		let el = document.createElement('textarea')
		el.classList.add("form-control")
		el.rows=6
		el.textContent=descriptionElValue
		el.setAttribute('data-json',parentDiv.getAttribute('data-json'))


		//description
		let p = document.createElement('p')
		p.classList.add(`category-description-${categoryId}`)
		p.textContent = descriptionElValue

		//add button
		let createButton = document.createElement('button')
		createButton.classList.add('btn','btn-sm','btn-danger')
		createButton.type = "button"
		createButton.textContent = "enter"
		createButton.addEventListener('click',this.updateCategory.bind(a))

		//status
		let status = document.createElement('span')
		status.classList.add('category-field-status','text-danger')
		status.innerHTML = `<br/><p><small>Click <span class="category-field-status-create-button-${categoryId}"></span> to save or press <span class="badge badge-sm badge-light">Esc</span> to cancel </small></p>`


		//if no value or no changes
		el.addEventListener('blur',()=>{
				if(el.value.length<1||el.value==descriptionElValue){
					//el.replaceWith(p)	
					//hide spinner
					window.bms.default.spinner.hide()
					//remove instruction
					//his.button.parentNode.children[0].innerHTML=''
				}
		})

		//on escape
		el.addEventListener('keyup',(e)=>{
			if(e.keyCode==27) try{ el.replaceWith(p);el.append(status)}catch(e){}
		})

		
		descriptionEl.replaceWith(el)
		
		//show status
		el.parentNode.insertBefore(status,el)
		document.querySelector(`.category-field-status-create-button-${categoryId}`).append(createButton)

	}



	bindUpdateModalButton(){
		let el = document.querySelectorAll('.product-update-modal-button')
		el.forEach((el,index)=>{
			let a = Object.assign({ __proto__: this.__proto__ }, this)
			el.removeEventListener('click',this.loadUpdateInputField.bind(a))
			el.addEventListener('click',this.loadUpdateInputField.bind(a))
		})

	}

	updateCategory(){
		Cat.update(1).then((json)=>{
			var parsedData=JSON.parse(json)
			var data=parsedData.data
		})
	}

	bindDeleteModalButton(){
		let el = document.querySelectorAll('.product-delete-modal-button')
		el.forEach((el,index)=>{
			let a = Object.assign({ __proto__: this.__proto__ }, this)
			el.removeEventListener('click',this.loadDeleteModal.bind(a))
			el.addEventListener('click',this.loadDeleteModal.bind(a))
		})

	}


	toggleButton(el,dis="disabled"){
		if(dis=="disabled"){
			el.disabled="disabled"
			el.innerHTML='SAVING . . .'
		}else{
			el.removeAttribute('disabled')
			el.innerHTML='SAVE PROFILE'
		} 
	}

	showSuccessNotif(opt){
		let listSection=document.querySelector('.product-container')
		listSection.prepend(CatTemp.render({name:opt.name,description:opt.description,buttons:['update','remove']}))
	}
	showErrorNotif(){
		document.querySelector('#reg-notif-area').innerHTML=`
			<div class="alert alert-danger" role="alert">
				<i class="material-icons">close</i> Oops! Something went wrong. Please try again later 
			</div>`
	}

}







const scrollTo=(offset)=>{
	document.querySelector('div[name="/suppliers/forms/registration"]').scrollTop=offset
}


const resetForm=()=>{
	document.querySelector('form[name="registration"]').reset()
}




//let button=document.querySelector('#modal-dialog-add-category-button')
//button.addEventListener('click',addCategory)