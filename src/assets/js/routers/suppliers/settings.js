const appRoute=new window.bms.exports.Router('http://localhost/bms_rethink/www/',true)
import Categories from '../../modules/Suppliers/Components/Products/Categories/Categories.js'
import CatTemplate from '../../modules/Suppliers/Templates/Products/Categories/Categories.js'
import ListComp from '../../modules/Suppliers/Components/List/List.js'
import PopupES from '../../Components/PopupES/PopupES.js'

let Cat=new Categories()
let ListC=new ListComp()
let PopupInstance

const loadSettingsSection=()=>{ 
	return new Promise((resolve,reject)=>{
		var html=`<dialog id="modal" data-popup="fade">
					<div class="content">
						<!--close button-->
						<a href="#" data-popup-toggle="close">x</a>
						<div class="header"></div>
						<div class="body" id="modal-settings-body"></div>
					</div>	
				</dialog>

		<section class="profile-tabs profile-tabs-about">
			<div class="profile-section">
				<h5><i class="material-icons md-18">settings</i> Settings</h5>
				<hr/>
				<div class="settings-container">
					<div class="settings-update-section"></div>
					<div class="settings-block-section"></div>
					<div class="settings-delete-section"></div>
				</div>
			</div>
		</section>`

		let el=document.querySelector('route[name="/suppliers/settings"]')
		el.innerHTML=html

		resolve(el)
	})
}

const loadUpdateSec=()=>{
	let el=document.querySelector('.settings-update-section')
	var htm=`
		<div>
			<h5>Update</h5>
			<p class="text-secondary"><i class="material-icons md-18">update</i> Update company information</p>
			<p><button type="button" class="btn btn-sm btn-secondary">UPDATE</button></p>
			<hr/>
		</div>
	`
	el.innerHTML=htm
	el.style.display="block"
}

const loadBlockSec=()=>{
	return new Promise((resolve,reject)=>{
		let el=document.querySelector('.settings-block-section')
		var htm=`
			<div>
				<h5 class="text-danger">Block</h5>
				<p class="text-danger">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam
				</p>
				<p><button type="button" class="btn btn-sm btn-danger" id="block-suppliers-button-modal" data-target="#modal" data-popup-toggle="open">BLOCK</button></p>
				<hr/>
			</div>
		`
		el.innerHTML=htm
		el.style.display="block"

		resolve(htm)
	})
}

const loadUnblockSec=()=>{
	return new Promise((resolve,reject)=>{
		let el=document.querySelector('.settings-block-section')
		var htm=`
			<div>
				<h5 class="text-danger">Unblock</h5>
				<p class="text-danger">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam
				</p>
				<p><button type="button" class="btn btn-sm btn-danger" id="unblock-suppliers-button-modal" data-target="#modal" data-popup-toggle="open">UNBLOCK</button></p>
				<hr/>
			</div>
		`
		el.innerHTML=htm
		el.style.display="block"

		resolve(htm)
	})
}


const loadDeleteSec=()=>{
	let el=document.querySelector('.settings-delete-section')
	var htm=`
		<div>
			<h5 class="text-danger">Delete</h5>
			<div class="col" style="background:#e13d34;color:#fff;padding:10px;">
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam
				</p>
				<p>
					<button type="button" class="btn btn-sm btn-light" id="delete-suppliers-button-modal" data-target="#modal" data-popup-toggle="open">DELETE</button>
				</p>
			</div>
		</div>
	`
	el.innerHTML=htm
	el.style.display="block"
}

const loadDeleteSecSuccess=()=>{
	document.querySelector('[name="/suppliers/settings"]').innerHTML=`
		<div class="col-xs-12" style="margin-top:30%;">
			<div class="alert alert-danger" role="alert">
				This item no longer exist. Please make sure that you have enough privilege to view this item.
			</div>
		</div>
	`
}

const loadDeleteModal=()=>{

		const XHR=new window.bms.exports.XHR()
		const URL='pages/suppliers/modal/remove.html'
		const id=window.bms.default.state.supplier.cur.id

		return XHR.request({method:'GET',url:URL}).then(res=>{
			document.getElementById('modal-settings-body').innerHTML=res
			setTimeout(()=>{
				//remove cancel
				document.getElementById('modal-dialog-close-button').addEventListener('click',()=>{
					PopupInstance.closeAll()
				})

				//remove cont.
				document.getElementById('modal-dialog-remove-button').addEventListener('click',()=>{
					window.bms.default.spinner.show()

					ListC.remove(id).then((json)=>{
						//process XHR HERE
					
						window.bms.default.spinner.hide()
						PopupInstance.closeAll()
						removeItemFromList()
						loadDeleteSecSuccess()

					}).catch((err)=>{
						alert('Oops something went wrong!Please try again later.')
					})
					
				})
			})
		}).catch(e=>{})
	
}



const loadBlockModal=()=>{

		const XHR=new window.bms.exports.XHR()
		const URL='pages/suppliers/settings/modal/block.html'
		const id=window.bms.default.state.supplier.cur.id

		return XHR.request({method:'GET',url:URL}).then(res=>{
			document.getElementById('modal-settings-body').innerHTML=res
			setTimeout(()=>{
				//remove cancel
				document.getElementById('modal-dialog-close-button').addEventListener('click',()=>{
					PopupInstance.closeAll()
				})

				//remove cont.
				document.getElementById('modal-dialog-block-button').addEventListener('click',()=>{
					window.bms.default.spinner.show()

					//process XHR HERE
					ListC.block(id).then((json)=>{
						window.bms.default.spinner.hide()
						PopupInstance.closeAll()
						loadUnblockSec().then(e=>{
							PopupInstance=new PopupES()

							//re enable blocking

							let blockButtonDialog=document.querySelector('#unblock-suppliers-button-modal')
							blockButtonDialog.removeEventListener('click',loadBlockModal)
							//block
							blockButtonDialog.addEventListener('click',loadUnblockModal)
							
						})
					}).catch(e=>{
						alert('Sorry,unable to process your request.Please try again later.')
					})

				
				})
			})
		}).catch(e=>{})
	
}


const loadUnblockModal=()=>{
		
		const XHR=new window.bms.exports.XHR()
		const URL='pages/suppliers/settings/modal/block.html'
		const id=window.bms.default.state.supplier.cur.id

		return XHR.request({method:'GET',url:URL}).then(res=>{
			document.getElementById('modal-settings-body').innerHTML=res
			setTimeout(()=>{
				//remove cancel
				document.getElementById('modal-dialog-close-button').addEventListener('click',()=>{
					PopupInstance.closeAll()
				})

				//remove cont.
				document.getElementById('modal-dialog-block-button').addEventListener('click',()=>{
					window.bms.default.spinner.show()

					//process XHR HERE
					ListC.unblock(id).then((json)=>{
						window.bms.default.spinner.hide()
						PopupInstance.closeAll()
						loadBlockSec().then(e=>{
							PopupInstance=new PopupES()
							//re-enable blocking function
							let blockButtonDialog=document.querySelector('#block-suppliers-button-modal')
							blockButtonDialog.removeEventListener('click',loadUnblockModal)
							//block
							blockButtonDialog.addEventListener('click',loadBlockModal)

						})
					})

					
				})
			})
		}).catch(e=>{})
	
}

const removeItemFromList=()=>{
	//remove from view
	const id=window.bms.default.state.supplier.cur.id
	document.querySelector(`.list-section > div[data-list="${id}"]`).remove()
}

appRoute.on({
 	'/*':()=>{
 		//required
 	},
	'/suppliers/:id/settings':(params)=>{ 
		

		window.bms.default.changeDisplay(['route[name="/suppliers/settings"]'],'block')
		window.bms.default.changeDisplay(['route[name="/suppliers/products"]','route[name="/suppliers/about"]','route[name="/suppliers/accounts"]','route[name="/suppliers/logs"]'],'none')

		loadSettingsSection().then(()=>{

			let details=window.bms.default.state.supplier.cur
			
			loadUpdateSec()
			loadDeleteSec()

			setTimeout(()=>{
				if(details.data.status==0){
					loadBlockSec()
					let blockButtonDialog=document.querySelector('#block-suppliers-button-modal')
					//block
					blockButtonDialog.addEventListener('click',loadBlockModal)
				}

				if(details.data.status==2){
					loadUnblockSec()
					let blockButtonDialog=document.querySelector('#unblock-suppliers-button-modal')
					blockButtonDialog.addEventListener('click',loadUnblockModal)
				}
				
				//enable dynamic dialog
				PopupInstance=new PopupES()
			},2500)


			//remove
			let delButtonDialog=document.querySelector('#delete-suppliers-button-modal')
			delButtonDialog.addEventListener('click',loadDeleteModal)


		})
	}
}).resolve()

