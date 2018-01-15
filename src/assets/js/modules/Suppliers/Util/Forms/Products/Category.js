import CatComp from '../../../Components/Products/Categories/Categories.js'
import CatTemplate from '../../../Templates/Products/Categories/Categories.js'

var CatTemp=new CatTemplate()



const addCategory=function(e){	
	//disable
	toggleButton(this,"disabled")
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

	

	var Cat=new CatComp()

	Cat.register(data).then(json=>{
		var parsedJson=JSON.parse(json)

		if(parsedJson.data){
			showSuccessNotif(data)
		}else{
			showErrorNotif(data)	
		}
	
		//enable button
		setTimeout(()=>{
			toggleButton(this,"enabled")
			window.bms.default.spinner.hide()

			//hide modal
			document.querySelector('#product-modal').close()
		},500)

		
	})
}


const showSuccessNotif=(opt)=>{
	let listSection=document.querySelector('.product-container')
	listSection.prepend(CatTemp.render({name:opt.name,description:opt.description,buttons:['update','remove']}))
}
const showErrorNotif=()=>{
	document.querySelector('#reg-notif-area').innerHTML=`
		<div class="alert alert-danger" role="alert">
			<i class="material-icons">close</i> Oops! Something went wrong. Please try again later 
		</div>`
}

const scrollTo=(offset)=>{
	document.querySelector('div[name="/suppliers/forms/registration"]').scrollTop=offset
}


const resetForm=()=>{
	document.querySelector('form[name="registration"]').reset()
}

const toggleButton=(el,dis="disabled")=>{
	if(dis=="disabled"){
		el.disabled="disabled"
		el.innerHTML='SAVING . . .'
	}else{
		el.removeAttribute('disabled')
		el.innerHTML='SAVE PROFILE'
	} 
}


let button=document.querySelector('#modal-dialog-add-category-button')
button.addEventListener('click',addCategory)