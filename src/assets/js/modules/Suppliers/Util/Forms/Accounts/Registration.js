import RegComp from '../../../Components/Accounts/Accounts.js'
//import PopupES from '../../../Components/PopupES/PopupES.js'

let PopupInstance

const saveAccount=function(e){
	//disable
	toggleButton(this,"disabled")
	window.bms.default.spinner.show()

	let username=document.querySelector('form[name="account-registration-form"] input[name="username"]')
	let password=document.querySelector('form[name="account-registration-form"] input[name="password"]')
	let passwordConfirmation=document.querySelector('form[name="account-registration-form"] input[name="password-confirmation"]')
	const id=window.bms.default.state.supplier.cur.id

	let data={
		username:username.value,
		password:password.value,
		id:id,
		action:'create'
	}

	

	var Reg=new RegComp()
	Reg.register(data).then(json=>{
		var parsedJson=JSON.parse(json)

		if(typeof parsedJson.data=='string'){
			data.id=parseInt(parsedJson.data)
			//load to view if suppliers list is available in DOM
			if(typeof prepend!="undefined") prependToList(data)
			
			//Proceed
			let target=document.querySelector('.account-table-list')

			if(!target){

				document.querySelector('.account-container').innerHTML=`
					<table class="table">
						<thead>
							<th>Username</th>
							<th>Password</th>
							<th></th>
						</thead>
						<tbody class="account-table-list"></tbody>
					</table>
				`
			}
			
			setTimeout(()=>{
				//reinitialize target
				target=document.querySelector('.account-table-list')
			 	prependToList(target,{username:username.value,id:data.id})
			 	resetForm() 
			 	window.bms.default.spinner.hide()
			})

		}else{
			showErrorNotif()	
		}

		//enable button
		setTimeout(()=>{toggleButton(this,"enabled")},500)
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

const resetForm=()=>{
	document.querySelector('form[name="account-registration-form"]').reset()
}

const toggleButton=(el,dis="disabled")=>{
	if(dis=="disabled"){
		el.disabled="disabled"
	}else{
		el.removeAttribute('disabled')
	} 
}

const prependToList=(target,json)=>{
	let el=document.createElement('tr')
	el.innerHTML=`
		<tr>
			<td>${json.username}</td>
			<td>**************</td>
			<td><button class="btn btn-sm btn-danger" data-target="#account-modal" data-popup-toggle="open">REMOVE</button></td>
		</tr>
	`
	target.prepend(el)

	//PopupInstance = new PopupES()
}


document.querySelector('#modal-dialog-add-account-button').removeEventListener('click',saveAccount)
document.querySelector('#modal-dialog-add-account-button').addEventListener('click',saveAccount)
