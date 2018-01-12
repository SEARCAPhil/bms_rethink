import RegComp from '../../../Components/Forms/Registration/Registration.js'
//Template is only available if suppliers list is loaded
const ListTemplate=window.bms.templates.suppliersList

const prepend=true

let listSection=document.querySelector('.list-section')


const getProfile=()=>{
	let data=window.bms.default.state.supplier.cur.data
window.bms.default.spinner.show()
	var name=document.querySelector('form[name="registration-update"] input#name')
	var alias=document.querySelector('form[name="registration-update"] input#alias')
	var website=document.querySelector('form[name="registration-update"] input#website')
	var industry=document.querySelector('form[name="registration-update"] input#industry')
	var tagline=document.querySelector('form[name="registration-update"] textarea#tagline')
	var location=document.querySelector('form[name="registration-update"] textarea#location')
	var about=document.querySelector('form[name="registration-update"] textarea#about')
	var number=document.querySelectorAll('.number')
	
	name.value=data.name||''
	alias.value=data.alias||''
	tagline.value=data.tagline||''
	location.value=data.location||''
	about.value=data.about||''
	industry.value=data.industry||''
}

const updateProfile=function(e){	
	//disable
	toggleButton(this,"disabled")
	//loading
	window.bms.default.spinner.show()

	let info=window.bms.default.state.supplier.cur.data
	let id=window.bms.default.state.supplier.cur.data.id

	var name=document.querySelector('form[name="registration-update"] input#name')
	var alias=document.querySelector('form[name="registration-update"] input#alias')
	var website=document.querySelector('form[name="registration-update"] input#website')
	var industry=document.querySelector('form[name="registration-update"] input#industry')
	var tagline=document.querySelector('form[name="registration-update"] textarea#tagline')
	var location=document.querySelector('form[name="registration-update"] textarea#location')
	var about=document.querySelector('form[name="registration-update"] textarea#about')
	var number=document.querySelectorAll('.number')

	//data
	var data={
		name:name.value,
		alias:alias.value,
		tagline:tagline.value,
		website:website.value,
		date:date.value,
		industry:industry.value,
		about:about.value,
		location:location.value,
		numbers:[],
		action:'update',
		id:id
	}

	//update info
	//multiple number
	number.forEach((el,index)=>{
		if(el.value.length>0) data.numbers.push(el.value)
	})

	var Reg=new RegComp()

	Reg.update(data).then(json=>{
		var parsedJson=JSON.parse(json)

		if(parsedJson.data){
			showSuccessNotif()
			//update state
			info.name=name.value
			info.alias=alias.value
			info.industry=industry.value
			info.tagline=tagline.value
			info.about=about.value
			info.location=location.value

		}else{
			showErrorNotif()	
		}

		
		//enable button
		setTimeout(()=>{
			toggleButton(this,"enabled")
			window.bms.default.spinner.hide()
		},500)

		
	})
}


const showSuccessNotif=()=>{
	document.querySelector('#reg-notif-area').innerHTML=`
	<div class="alert alert-success" role="alert">
			  <i class="material-icons">check_circle</i> Saved Successfully!
			</div>`
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

const addContactNumber=(e)=>{
	var input=document.createElement('input')
	input.type="text"
	input.placeholder="+(63)"
	input.classList.add("form-control")
	input.classList.add("number")
	input.style.marginBottom="20px"

	var el=document.querySelector('.number-section')
	el.append(input)
}


let button=document.querySelector('.update-supplier-button')
button.addEventListener('click',updateProfile)
//document.querySelector('#add-number-field').addEventListener('click',addContactNumber)

getProfile()