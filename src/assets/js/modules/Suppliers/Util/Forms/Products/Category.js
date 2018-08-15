import CatComp from '../../../Components/Products/Categories/Categories.js'
import CatTemplate from '../../../Templates/Products/Categories/Categories.js'
import PopupES from '../../../../../components/PopupES/PopupES.js'


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
			company_id:id,
			id:id
		}


		Cat.register(data).then(json=>{
			var parsedJson=JSON.parse(json)

			if(parsedJson.data){
				//update id in data to category's Primary Key
				data.id=parsedJson.data
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

	loadCategories(id){
		return new Promise((resolve,reject)=>{
				Cat.categories(id).then((json)=>{
					var parsedData=JSON.parse(json)
					var data=parsedData.data

					//empty
					if(data.length<1) reject(this)

					if(data){
						var CatTemp=new CatTemplate()
						var el=document.querySelector('.category-container')
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



	loadCategorySection(params={}){ 
		let el = document.querySelector('.category-menu-section')
		
		let btn = document.createElement('button')
		let a = Object.assign({ __proto__: this.__proto__ }, this)

		//buttons
		btn.classList.add("btn","btn-dark","btn-sm","float-right")
		btn.setAttribute('data-target','#product-modal')
		btn.setAttribute('data-popup-toggle','open')
		btn.innerHTML+='<i class="material-icons md-18">insert_drive_file</i> add +'



		btn.addEventListener('click',this.loadCategoryModal.bind(a))
		
		el.innerHTML+=`<h3 style="margin-top:20px;">Categories 
			<small style="font-size:12px;">
				<a class="active all" href="#/suppliers/${params.id}/products"><i class="material-icons md-18">local_mall</i> All</a>
				&emsp;<a class="categories" href="#/suppliers/${params.id}/products/tabs/categories">Categories</a>
			</small> 
			<span style="float:left;width:33px;height:33px;border-radius:50%;text-align:center;background:#009688;overflow:hidden;margin-left:10px;margin-right:10px;color:rgb(255,255,255);cursor:pointer;valign:bottom;padding:1px;"><i class="material-icons md-36">library_books</i></span>
			<span class="category-add-button-section"></span></h3><hr/>
		`
		//add button
		let btnSection = document.querySelector('.category-add-button-section')
		btnSection.append(btn)
		window.bms.default.spinner.hide()
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
		const id=window.bms.default.state.supplier.cur.id
		//parent
		const categoryId = e.target.getAttribute('data-category-id')
		const parentDiv = document.querySelector(`.category[data-list="${categoryId}"]`)
		const json = parentDiv.getAttribute('data-json')
	

		const descriptionEl = document.querySelector(`.category-description-${categoryId}`)
		const descriptionElValue = descriptionEl.innerText


		//category name parent
		let categoryNameParent = document.querySelector(`.category-name-${categoryId}`)


		//category name
		let categoryName = document.createElement('p')
		categoryName.classList.add('category-name',`category-name-${categoryId}`)
		categoryName.innerHTML=`
			<b><a href="#/suppliers/${id}/products/category/${categoryId}">${categoryNameParent.innerText}</a></b>
		`

		//category field
		let categoryField = document.createElement('input')
		categoryField.type = "text"
		categoryField.value = categoryNameParent.innerText
		categoryField.classList.add('form-control','category-name-text-field',`category-name-text-field-${categoryId}`)

		//textarea
		let el = document.createElement('textarea')
		el.classList.add("form-control",`category-description-textarea-${categoryId}`)
		el.rows=6
		el.textContent=descriptionElValue
		el.setAttribute('data-json',json)
		el.autofocus = 'autofocus'

		//description paragraph
		let p = document.createElement('p')
		p.classList.add(`category-description-${categoryId}`)
		p.textContent = descriptionElValue

		//add button
		let createButton = document.createElement('button')
		createButton.classList.add('btn','btn-sm','btn-danger')
		createButton.setAttribute('data-list',categoryId)
		createButton.type = "button"
		createButton.textContent = "enter"
		createButton.addEventListener('click',this.updateCategory.bind(a))

		//status
		let status = document.createElement('span')
		status.classList.add('category-field-status','text-danger',`category-field-status-${categoryId}`)
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
			if(e.keyCode==27){
				try{ 
					categoryField.replaceWith(categoryName)
					//revert description
					el.replaceWith(p);el.append(status)
				}catch(e){}
			} 
		})

		
		//DOM update
		categoryNameParent.replaceWith(categoryField)
		descriptionEl.replaceWith(el)
		
		//console.log(el.nextElementSibling.insertBefore(status))

		//show status
		el.parentNode.insertBefore(status,el.nextElementSibling)
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

	updateCategory(e){
		let id = e.target.getAttribute('data-list')
		let targetTextArea = document.querySelector(`.category-description-textarea-${id}`)
		let targetNameTextField = document.querySelector(`.category-name-text-field-${id}`)

		let data = {
			id: id,
			name: targetNameTextField.value,
			description: targetTextArea.value,
			action: 'update'
		}
		
		Cat.update(data).then((json)=>{
			var parsedData=JSON.parse(json)
			var data=parsedData.data

			if(!data){
				alert('Oops!Something went wrong. Please tray again later.')
				return 0;
			}

			//proceed
			let p = document.createElement('p')
			p.classList.add(`category-description-${id}`)
			p.textContent = targetTextArea.value

			targetTextArea.replaceWith(p)
			document.querySelector(`.category-field-status-${id}`).remove()

			//category name
			let categoryName = document.createElement('p')
			categoryName.classList.add('category-name',`category-name-${id}`)
			categoryName.innerHTML=`
				<b><a href="#/suppliers/${window.bms.default.state.supplier.cur.id}/products/category/${id}">${targetNameTextField.value}</a></b>
			`
			targetNameTextField.replaceWith(categoryName)
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
		let listSection=document.querySelector('.category-menu-section')
		listSection.append(CatTemp.render({name:opt.name,description:opt.description,id:opt.id,cid:opt.company_id,buttons:['update','remove']}))
		this.bindDeleteModalButton()
		this.bindUpdateModalButton()
		this.PopupInstance=new PopupES()
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
