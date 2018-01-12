import AccComp from '../../modules/Suppliers/Components/Accounts/Accounts.js'
import AccTemplate from '../../modules/Suppliers/Templates/Accounts/Accounts.js'
import AccUtilities from '../../modules/Suppliers/Util/Accounts/Accounts.js'
import PopupES from '../../Components/PopupES/PopupES.js'


const appRoute=new window.bms.exports.Router('http://localhost/bms_rethink/www/',true)
const XHR=new window.bms.exports.XHR()


let AccC=new AccComp()
let AccTemp=new AccTemplate()
let AccUTil=new AccUtilities()
let PopupInstance

const loadAccountSection=()=>{ 
	return new Promise((resolve,reject)=>{
		var html=`<dialog id="account-modal" data-popup="fade">
					<div class="content">
						<!--close button-->
						<a href="#" data-popup-toggle="close">x</a>
						<div class="header"></div>
						<div class="body" id="modal-account-body"></div>
					</div>	
				</dialog>

				<dialog id="account-settings-modal" data-popup="fade">
					<div class="content">
						<!--close button-->
						<a href="#" data-popup-toggle="close">x</a>
						<div class="header"></div>
						<div class="body" id="modal-account-settings-body"></div>
					</div>	
				</dialog>

				<section class="profile-tabs profile-tabs-accounts">
			<div class="accounts-section">
				<h5>Accounts</h5>
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation</p>
				<button class="btn btn-dark btn-sm" data-target="#account-modal" data-popup-toggle="open" id="create-account-button-modal">Add +</button>
				<hr/>
				<div class="account-container"></div>
			</div>
		</section>`

		let el=document.querySelector('route[name="/suppliers/accounts"]')
		el.innerHTML=html

		resolve(el)
	})
	


}


appRoute.on({
 	'/*':()=>{
 		//required
 	},
	'/suppliers/:id/accounts':(params)=>{ 
		
		window.bms.default.changeDisplay(['route[name="/suppliers/accounts"]'],'block')
		window.bms.default.changeDisplay(['route[name="/suppliers/products"]','route[name="/suppliers/about"]','route[name="/suppliers/settings"]','route[name="/suppliers/logs"]'],'none')

		loadAccountSection().then(()=>{
			//enable dynamic dialog
			PopupInstance=new PopupES()


			let createButtonDialog=document.querySelector('#create-account-button-modal')		
			createButtonDialog.addEventListener('click',AccUTil.loadCreateAccountModal)

			let target= document.querySelector('.account-container')

			AccC.lists(params.id).then(json=>{
				let parsedData=JSON.parse(json)
				let data=parsedData.data
				let dataLength=data.length


				if(dataLength<1){

					target.innerHTML=`
						<center style="margin-top:40px;">
							<i class="material-icons md-48">account_circle</i>
							<h5 class="text-muted">No registered account</h5>
							<small><p>View all accounts under your supervision</p></small>
						</center>
					`
					return 0
				}




				//proceed
				target.innerHTML+=`
					<table class="table">
						<thead>
							<th>Username</th>
							<th>Password</th>
							<th></th>
						</thead>
						<tbody class="account-table-list"></tbody>
					</table>
				`  

				//render account template
				setTimeout(()=>{
					let table=document.querySelector('.account-table-list')

					for(let x=0;x<dataLength;x++){

						table.appendChild(AccTemp.render({id:data[x].id,username:data[x].username,status:data[x].status}))
					}
					//enable popup for account settings
					PopupInstance = new PopupES()

					//enable deletion & bocking
					AccUTil.attachEventModalToDeleteButton()
					AccUTil.attachEventModalToBlockButton()
					AccUTil.attachEventToChangePass()
					
				})
		
			}).catch(err=>{})
		})
	}
}).resolve()

