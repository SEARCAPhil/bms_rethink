import ListService from '../Services/List/List'
import RequirementsService from '../Services/Requirements'
import IndexedDB from '../Util/Storage/Bidding'
import PopupES from '../../../components/PopupES/PopupES'

export default class {
	constructor () {
		this.XHR = new window.bms.exports.XHR()
		this.ListServ = new ListService()
		this.ReqServ = new RequirementsService()
		this.IDB = new IndexedDB()
	}

	removeRequirements (e) {
		window.bms.default.spinner.show()
		let data = {
			id: e.target.el.id,
			action: 'remove',
		}

		this.ListServ.removeRequirements(data).then((json) => {
			let res = JSON.parse(json)

			if(res.data){
				e.target.el.parentNode.parentNode.parentNode.parentNode.remove()
				document.getElementById('bidding-modal').close()
			}

			window.bms.default.spinner.hide()
			
		})
	}

	removeRecepients (e) { 
		window.bms.default.spinner.show()
		let data = {
			id: e.target.el.id,
			action: 'remove',
		}

		this.ReqServ.removeRecepients(data).then((json) => {
			let res = JSON.parse(json)

			if(res.data){
				e.target.el.parentNode.parentNode.parentNode.parentNode.remove()
				document.getElementById('bidding-modal').close()
				// remove from DOM
				document.getElementById(`requirements-recepients-list-${data.id}`).remove()
				// remove from indexeedDB here
			}

			window.bms.default.spinner.hide()
			
		})
	}

	loadRemoveRequirements (e) {
		const URL='pages/suppliers/modal/remove.html'
		const id=e.target.id
		const proto = Object.assign({ __proto__: this.__proto__ }, this)

		return this.XHR.request({method:'GET',url:URL}).then(res=>{
			let modalTarget=document.getElementById('modal-bidding-body')
			modalTarget.innerHTML=res

			setTimeout(()=>{
				window.bms.default.scriptLoader(modalTarget)
			},50)

			setTimeout(()=>{
				//remove cancel
				document.getElementById('modal-dialog-close-button').addEventListener('click',()=>{
		
					document.getElementById('bidding-modal').close()
					
				})

				let btn = document.getElementById('modal-dialog-remove-button')
				btn.el =  e.target
				btn.addEventListener('click', this.removeRequirements.bind(proto))
			})
		}).catch(e=>{})
	}

	loadRemoveRecepients (e) {
		const URL='pages/suppliers/modal/remove.html'
		const id=e.target.getAttribute('data-resources')
		const proto = Object.assign({ __proto__: this.__proto__ }, this)

		// hide dropdown section
		document.getElementById(`dropdown-req-recepients-${id}`).classList.remove('open')

		return this.XHR.request({method:'GET',url:URL}).then(res=>{
			let modalTarget=document.getElementById('modal-bidding-body')
			modalTarget.innerHTML=res

			setTimeout(()=>{
				window.bms.default.scriptLoader(modalTarget)
			},50)

			setTimeout(()=>{
				//remove cancel
				document.getElementById('modal-dialog-close-button').addEventListener('click',()=>{
		
					document.getElementById('bidding-modal').close()
					
				})

				let btn = document.getElementById('modal-dialog-remove-button')
				e.target.id = id
				btn.el =  e.target
				btn.addEventListener('click', this.removeRecepients.bind(proto))
			})
		}).catch(e=>{})
	}

	loadProposalForm (e) {
		const URL='pages/bidding/forms/proposals/index.html'
		const target = document.querySelector('[name="/bids/info/particulars/proposals/form"]')
		const proto = Object.assign({ __proto__: this.__proto__ }, this)
		const sec = document.querySelector('.specs-section-proposal')

		return new Promise((resolve, reject) => {
			if (sec) {
				resolve()
				return 0
			}

			this.XHR.request({method:'GET',url:URL}).then(res=>{
				target.innerHTML=res
				resolve(res)
			}).catch(e=>{})
		})

	}


	loadSendProposal (e) {
		const URL='pages/bidding/modal/send-proposals.html'
		const id=1
		const proto = Object.assign({ __proto__: this.__proto__ }, this)

		return this.XHR.request({method:'GET',url:URL}).then(res=>{
			let modalTarget=document.getElementById('modal-bidding-body')
			modalTarget.innerHTML=res

			setTimeout(()=>{
				window.bms.default.scriptLoader(modalTarget)
			},50)

			setTimeout(()=>{
				//remove cancel
				document.getElementById('modal-dialog-close-button').addEventListener('click',()=>{
		
					document.getElementById('bidding-modal').close()
					
				})

				let btn = document.getElementById('modal-dialog-remove-button')
				e.target.id = id
				btn.el =  e.target
				btn.addEventListener('click', this.removeRecepients.bind(proto))
			})
		}).catch(e=>{})
	}


	bindRemoveRequirements () {
		const proto = Object.assign({ __proto__: this.__proto__ }, this)
		document.querySelectorAll('.remove-requirements-modal-btn').forEach((val, index) => {
			val.addEventListener('click',this.loadRemoveRequirements.bind(proto))
		})
	}

	appendAttachments (data) {
		const attSec = document.getElementById('attachments-requirements-info-section')
		attSec.innerHTML += `	<div class="col-lg-3 col-md-3" style="padding:5px;background:#e9ecef;border:1px solid #fefefe;">
									<div class="d-flex align-items-stretch">
										<div class="col">
											<div class="file-icon file-icon-sm" data-type="${data.type}"></div> ${data.original_filename}
										</div>

										<div class="col-1">
											<i class="material-icons md-18 device-dropdown" data-device-dropdown="dropdown-req-${data.id}" data-resources="${data.id}">arrow_drop_down</i>
											<div class="dropdown-section float-right" id="dropdown-req-${data.id}">
												<ul class="list-group list-group-flush">
		  											<li class="list-group-item "><a href="#" onclick="event.preventDefault();window.open('http://192.168.80.56/bms_api/src/api/bidding/requirements/attachments/download.php?id=${data.id}')">Download</a></li>
													<li class="list-group-item"><a data-target="#bidding-modal" data-popup-toggle="open" href="#" class="remove-attachments-modal">Remove</a></li>
												<ul>
											</div>
										</div>
									</div>
								</div>`
	}

	sendRequirements (e) {
		window.bms.default.spinner.show()
		let data = {
			id: window.bms.default.state.bidding.cur.requirements.id,
			suppliers: window.bms.bidding.suppliersSendingList,
			action: 'send',
		}

		this.ReqServ.send(data).then((json) => {
			let res = JSON.parse(json)
			const target = document.querySelector('.attachment-recepients-section')

			if(res.data){
				const html = document.createElement('div')
				html.classList.add('col-lg-2', 'col-md-2')
				html.setAttribute('style', 'padding:5px;background:#393f45;border:1px solid #fefefe;color:#fff;')
				html.id = `requirements-recepients-list-${res.data}`
				html.innerHTML = `<div class="d-flex align-items-stretch">
									<div class="col-9">
										<div style="float:left;width:100%;max-height:30px;overflow:hidden;text-overflow:ellipsis;">abcdef</div>
									</div>

									<div class="col-1">
										<i class="material-icons md-18 device-dropdown" data-device-dropdown="dropdown-req-recepients-${res.data}" data-resources="2">arrow_drop_down</i>
										<div class="dropdown-section float-right" id="dropdown-req-recepients-${res.data}">
											<ul class="list-group list-group-flush">
												<li class="list-group-item"><a data-target="#bidding-modal" data-popup-toggle="open" href="#" class="remove-receipients-modal" data-resources="2">Cancel Invitation</a></li>
											<ul>
										</ul></ul></div>
									</div>
								</div>`
				target.append(html)
				// e.target.el.parentNode.parentNode.parentNode.parentNode.remove()
				document.getElementById('bidding-requirements-modal').close()

				setTimeout(() => {
						// dropdown
						window.bms.default.dropdown('device-dropdown')
						// enable popup
						const PopupInstance = new PopupES()
				},1000)


			}

			window.bms.default.spinner.hide()
			
		})
	}


	loadSendRequirements (e) {
		const URL='pages/bidding/modal/send-requirements.html'
		const id=e.target.id
		const proto = Object.assign({ __proto__: this.__proto__ }, this)

		return this.XHR.request({method:'GET',url:URL}).then(res=>{
			let modalTarget=document.getElementById('modal-bidding-requirements-body')
			modalTarget.innerHTML=res

			setTimeout(()=>{
				window.bms.default.scriptLoader(modalTarget)
			},50)

			setTimeout(()=>{
				//remove cancel
				document.getElementById('modal-dialog-close-button').addEventListener('click',()=>{
		
					document.getElementById('bidding-requirements-modal').close()
					
				})

				let btn = document.getElementById('modal-dialog-send-button')
				btn.el =  e.target
				btn.addEventListener('click', this.sendRequirements.bind(proto))
			})
		}).catch(e=>{})
	}


	bindSendRequirements () {
		const proto = Object.assign({ __proto__: this.__proto__ }, this)
		document.querySelectorAll('.send-requirements-modal-btn').forEach((val, index) => {
			val.addEventListener('click',this.loadSendRequirements.bind(proto))
		})
	}

	bindRemoveRecepients () {
		const proto = Object.assign({ __proto__: this.__proto__ }, this)
		document.querySelectorAll('.remove-receipients-modal').forEach((val, index) => {
			val.addEventListener('click',this.loadRemoveRecepients.bind(proto))
		})
	}

	bindShowProposalSection (id) {
		// link to form
		document.querySelector('.requirements-proposal-link').href = `#/bids/requirements/${id}/proposal/form`
		// handler
		document.querySelectorAll('.proposal-requirement-dialog-btn').forEach((el, index) => {
			el.addEventListener('click', () => {
				// show/hide section
				document.querySelector('[name="/bids/info/particulars/proposals"]').classList.toggle('hide')

			})
		})
	}

	bindSendProposal () {
		const proto = Object.assign({ __proto__: this.__proto__ }, this)
		document.querySelectorAll('.send-bidding-modal-btn').forEach((val, index) => {
			val.addEventListener('click',this.loadSendProposal.bind(proto))
		})
	}



}