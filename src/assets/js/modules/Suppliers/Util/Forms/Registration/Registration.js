import RegComp from '../../../Components/Forms/Registration/Registration.js'
//Template is only available if suppliers list is loaded
const ListTemplate=window.bms.templates.suppliersList

const prepend=true

let listSection=document.querySelector('.list-section')


const saveProfile=function(e){
	
	//disable
	toggleButton(this,"disabled")

	//inputs
	var name=document.querySelector('#name')
	var alias=document.querySelector('#alias')
	var tagline=document.querySelector('#tagline')
	var website=document.querySelector('#website')
	var date=document.querySelector('#date')
	var industry=document.querySelector('#industry')
	var about=document.querySelector('#about')
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
		numbers:[]
	}

	//multiple number
	number.forEach((el,index)=>{
		if(el.value.length>0) data.numbers.push(el.value)
	})

	var Reg=new RegComp()
	Reg.register(data).then(json=>{
		var parsedJson=JSON.parse(json)
		console.log(typeof parsedJson.data)
		if(typeof parsedJson.data=='string'){
			data.id=parseInt(parsedJson.data)
			//load to view if suppliers list is available in DOM
			if(typeof prepend!="undefined") prependToList(data)
			resetForm()
			scrollTo(0)	
			showSuccessNotif()

		}else{
			showErrorNotif()	
		}

		//enable button
		setTimeout(()=>{toggleButton(this,"enabled")},500)
		
	})

}

const prependToList=(data)=>{
	let List=new ListTemplate()
	listSection.prepend(List.render({id:data.id,name:data.name,description:data.about,tagline:data.tagline,class:'col-xs-12 col-md-12 col-sm-12 list',established:data.date}))
}

const showSuccessNotif=()=>{
	document.querySelector('#reg-notif-area').innerHTML=`
	<div class="alert alert-success" role="alert">
			  <i class="material-icons">check_circle</i> Saved Successfully!
			</div>`
}
const scrollTo=(offset)=>{
	document.querySelector('div[name="/suppliers/forms/registration"]').scrollTop=offset
}

const showErrorNotif=()=>{
	document.querySelector('#reg-notif-area').innerHTML=`
		<div class="alert alert-danger" role="alert">
			<i class="material-icons">close</i> Oops! Something went wrong. Please try again later 
		</div>`
}

const resetForm=()=>{
	document.querySelector('form[name="registration"]').reset()
}

const toggleButton=(el,dis="disabled")=>{
	if(dis=="disabled"){
		el.disabled="disabled"
	}else{
		el.removeAttribute('disabled')
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

document.querySelector('.add-supplier-button').removeEventListener('click',saveProfile)
document.querySelector('.add-supplier-button').addEventListener('click',saveProfile)

//document.querySelector('#add-number-field').addEventListener('click',addContactNumber)