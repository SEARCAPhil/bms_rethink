import AccComp from '../../../../modules/Suppliers/Components/Accounts/Accounts.js'
import PopupES from '../../../../Components/PopupES/PopupES.js'

const AccC = new AccComp()

export default class{
	constructor(){
		//enable popup for account settings
		this.PopupInstance = new PopupES()
	}

	loadCreateAccountModal(){
		console.log(this)
			const XHR=new window.bms.exports.XHR()
				const URL='pages/suppliers/accounts/forms/register.html'
				const id=window.bms.default.state.supplier.cur.id

				return XHR.request({method:'GET',url:URL}).then(res=>{
					let modalTarget=document.getElementById('modal-account-body')
					modalTarget.innerHTML=res

					setTimeout(()=>{
						window.bms.default.scriptLoader(modalTarget)
					},50)

					setTimeout(()=>{
						//remove cancel
						document.getElementById('modal-dialog-close-button').addEventListener('click',()=>{
							document.querySelector('#account-modal').close()
						})
					})
				}).catch(e=>{})

		}

	loadRemoveAccountModal(){
		
		//save to state as currently selected account
		if(!window.bms.default.state.account.cur) window.bms.default.state.account.cur={}
		window.bms.default.state.account.cur.data=JSON.parse(this.props)
		

		const XHR=new window.bms.exports.XHR()
			const URL='pages/suppliers/modal/remove.html'
			const id=window.bms.default.state.supplier.cur.id

			return XHR.request({method:'GET',url:URL}).then(res=>{
				let modalTarget=document.getElementById('modal-account-settings-body')
				modalTarget.innerHTML=res

				setTimeout(()=>{
					window.bms.default.scriptLoader(modalTarget)
				},50)

				setTimeout(()=>{
					//remove cancel
					document.getElementById('modal-dialog-close-button').addEventListener('click',()=>{
						
						this.PopupInstance.closeAll()
					})
					//copy methods
					
					document.getElementById('modal-dialog-remove-button').addEventListener('click',this.removeAccount.bind(this))
				})
			}).catch(e=>{})

	}

	loadBlockAccountModal(){

		//save to state as currently selected account
		if(!window.bms.default.state.account.cur) window.bms.default.state.account.cur={}
		window.bms.default.state.account.cur.data=JSON.parse(this.props)

		//mark button as loaded
		this.button.classList.add('event-listening')

		const XHR=new window.bms.exports.XHR()
			const URL='pages/suppliers/settings/modal/block.html'
			const id=window.bms.default.state.supplier.cur.id

			return XHR.request({method:'GET',url:URL}).then(res=>{
				let modalTarget=document.getElementById('modal-account-settings-body')
				modalTarget.innerHTML=res

				setTimeout(()=>{
					window.bms.default.scriptLoader(modalTarget)
				},50)

				setTimeout(()=>{
					//remove cancel
					document.getElementById('modal-dialog-close-button').addEventListener('click',()=>{
	
						this.PopupInstance.closeAll()
					})

					document.getElementById('modal-dialog-block-button').addEventListener('click',this.blockAccount.bind(this))
				})
			}).catch(e=>{})

	}


	removeAccount(id){
		let accountId = window.bms.default.state.account.cur.data.id
		window.bms.default.spinner.show()

		AccC.remove({id:accountId,action:'remove'}).then(json=>{
					let parsedData=JSON.parse(json)
					let data=parsedData.data


					if(data!=1){
						alert('Oops!Something went wrong. Please try again later.')
					}else{
						//close modals
						this.PopupInstance.closeAll()
						//remove all buttons
						document.querySelectorAll(`tr[data-list="${accountId}"] button`).forEach((el,index)=>{
							el.remove()
						})	

						document.querySelector(`tr[data-list="${accountId}"] td:nth-child(3)`).innerHTML="<span class='badge badge-pill badge-danger'>REMOVED</span>"	
					}


					window.bms.default.spinner.hide()

		}).catch(err=>{ console.log(err);alert('Oops!Something went wrong. Please try again later.')})


	}


	blockAccount(id){
		let accountId = window.bms.default.state.account.cur.data.id
		let status = window.bms.default.state.account.cur.data.status
		let action = status==0?'block':(status==2?'unblock':'block')
		window.bms.default.spinner.show()

		AccC.block({id:accountId,action:action}).then(json=>{
					let parsedData=JSON.parse(json)
					let data=parsedData.data

					

					if(data!=1){
						alert('Oops!Something went wrong. Please try again later.')
					}else{
						//close modals
						this.PopupInstance.closeAll()

						//change state
						window.bms.default.state.account.cur.data.status = (status==0?2:0)

						//change button
						let el = document.createElement('button')
						el.classList.add("btn", "btn-sm", "btn-danger" ,"account-block-button")
						el.setAttribute('data-prop',JSON.stringify(window.bms.default.state.account.cur.data))
						el.setAttribute('data-item',accountId)
						el.setAttribute('data-target','#account-settings-modal')
						el.setAttribute('data-popup-toggle','open')
						el.innerHTML = `${(status==0?'UNBLOCK':'BLOCK')}`

						this.button.replaceWith(el)
		
						//re initialize buttons
						this.PopupInstance = new PopupES()
						this.attachEventModalToBlockButton()
					}


					window.bms.default.spinner.hide()

		}).catch(err=>{ console.log(err); alert('Oops!Something went wrong. Please try again later.')})


	}


	attachEventModalToDeleteButton(){
		let target = document.querySelectorAll('.account-delete-button')

		target.forEach((el,index)=>{
			//clone class methods
			let  a=Object.assign({ __proto__: this.__proto__ }, this)
			a.props=el.getAttribute('data-prop')
			el.removeEventListener('click',this.loadRemoveAccountModal.bind(a))
			el.addEventListener('click',this.loadRemoveAccountModal.bind(a))	
		})


	}

	attachEventModalToBlockButton(){
		let target = document.querySelectorAll('.account-block-button:not(.listening)')

		target.forEach((el,index)=>{
			//mark as listening
			el.classList.add('listening')
			//clone class methods
			let  a=Object.assign({ __proto__: this.__proto__ }, this)
			a.props=el.getAttribute('data-prop')
			a.button=el
			el.removeEventListener('click',this.loadBlockAccountModal)
			el.addEventListener('click',this.loadBlockAccountModal.bind(a))
			
		})
	}

		
}