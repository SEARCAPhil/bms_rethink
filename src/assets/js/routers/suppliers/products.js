const appRoute=new window.bms.exports.Router('http://localhost/bms_rethink/www/',true)
//import PopupEs from '../../../../../node_modules/popup-es/src/js/popup-es.js'
import Categories from '../../modules/Suppliers/Components/Products/Categories/Categories.js'
import CatTemplate from '../../modules/Suppliers/Templates/Products/Categories/Categories.js'
import PopupES from '../../Components/PopupES/PopupES.js'

//window.bms.exports.PopupEs=PopupEs
const XHR=new window.bms.exports.XHR()
let Cat=new Categories()
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
				<div class="product-menu-section"></div>
				<hr/>
				<div class="product-container"></div>
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
						el.append(CatTemp.render({name:x.name,description:x.description,id:x.id,buttons:['update','remove']}))
						resolve(this)
					}

				}else{
					reject(this)
				}
				
				
			})
	})
}

const loadCategorySection=()=>{ 
	let el = document.querySelector('.product-menu-section')
	let btn = document.createElement('button')
	btn.classList.add("btn","btn-dark","btn-sm")
	btn.setAttribute('data-target','#product-modal')
	btn.setAttribute('data-popup-toggle','open')
	btn.textContent='category +'

	btn.addEventListener('click',loadCategoryModal)
	
	el.append(btn)

	PopupInstance=new PopupES()
}

const loadCategoryModal=(id)=>{
	return new Promise((resolve,reject)=>{
		XHR.request({url:'./pages/suppliers/products/forms/category.html',method:'GET'}).then((data)=>{
			var el=document.querySelector('#modal-product-body')
			el.innerHTML=data

			setTimeout(()=>{
				window.bms.default.scriptLoader(el)

				//remove cancel
				document.getElementById('modal-dialog-close-button').addEventListener('click',()=>{
					PopupInstance.closeAll()
				})

			},100)

			resolve(data)
		})
	}) 
	
}


const loadDeleteModal=(e)=>{

		const XHR=new window.bms.exports.XHR()
		const URL='pages/suppliers/modal/remove.html'
		const id=window.bms.default.state.supplier.cur.id
		
		const categoryId=e.target.getAttribute('data-category-id')

		return XHR.request({method:'GET',url:URL}).then(res=>{
			document.getElementById('modal-product-body').innerHTML=res
			setTimeout(()=>{
				//remove cancel
				document.getElementById('modal-dialog-close-button').addEventListener('click',()=>{
					PopupInstance.closeAll()
				})

				//remove cont.
				document.getElementById('modal-dialog-remove-button').addEventListener('click',()=>{
					window.bms.default.spinner.show()

					let data = {id:categoryId,action:'remove'}
					Cat.remove(data).then((json)=>{
						//process XHR HERE
					
						window.bms.default.spinner.hide()
						PopupInstance.closeAll()
						document.querySelector(`.category[data-list="${categoryId}"]`).remove()

					}).catch((err)=>{
						alert('Oops something went wrong!Please try again later.')
		
					})
					
				})
			})
		}).catch(e=>{})
	
}

const loadUpdateInputField=(e)=>{
	const categoryId = e.target.getAttribute('data-category-id')

	const descriptionEl = document.querySelector(`.category-description-${categoryId}`)

	const descriptionElValue = descriptionEl.innerText

	descriptionEl.innerHTML=`
		<textarea class="form-control" rows="6">${descriptionElValue}</textarea>
		<span class="text-danger"><br/>Click <button class="btn btn-sm btn-danger" type="button">Enter</button> to save or press <span class="badge badge-sm badge-light">Esc</span> to cancel </span>
	`

}


const bindDeleteModalButton=()=>{
	let el = document.querySelectorAll('.product-delete-modal-button')
	el.forEach((el,index)=>{
		el.removeEventListener('click',loadDeleteModal)
		el.addEventListener('click',loadDeleteModal)
	})

}

const bindUpdateModalButton=()=>{
	let el = document.querySelectorAll('.product-update-modal-button')
	el.forEach((el,index)=>{
		el.removeEventListener('click',loadUpdateInputField)
		el.addEventListener('click',loadUpdateInputField)
	})

}



appRoute.on({
 	'/*':()=>{
 		//required
 	},
	'/suppliers/:id/products':(params)=>{ 

		window.bms.default.changeDisplay(['route[name="/suppliers/about"]','route[name="/suppliers/settings"]','route[name="/suppliers/logs"]','route[name="/suppliers/logs"]','route[name="/suppliers/accounts"]'],'none')
		window.bms.default.changeDisplay(['route[name="/suppliers/products"]'],'block')

		loadProductSection().then(()=>{
				//load menu
				loadCategorySection()


			loadProd(params.id).then(e=>{
				window.bms.default.spinner.hide()
				PopupInstance=new PopupES()
				 bindDeleteModalButton()
				 bindUpdateModalButton()
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

		
	},
}).resolve()

