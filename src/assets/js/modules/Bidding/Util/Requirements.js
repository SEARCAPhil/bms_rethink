import ListService from '../Services/List/List'
import RequirementsService from '../Services/Requirements'
import ProposalService from '../../Invitation/Services/Proposal'
import IndexedDB from '../Util/Storage/Bidding'
import PopupES from '../../../components/PopupES/PopupES'

export default class {
	constructor () {
		this.XHR = new window.bms.exports.XHR()
		this.ListServ = new ListService()
		this.ReqServ = new RequirementsService()
		this.PropServ = new ProposalService()
		this.IDB = new IndexedDB()
	}


	get (id) { 
		//window.bms.default.spinner.show()
		let data = {
			id,
			token: window.localStorage.getItem('token'),
		}

		return new Promise((resolve, reject) => {
			this.ReqServ.view(data).then((json) => {
				let res = JSON.parse(json)
			
				if(res[0]){
					window.bms.default.spinner.hide()
					resolve(res[0])
				}


			})
		})
	}


	removeRequirements (e) {
		window.bms.default.spinner.show()
		let data = {
			id: e.target.el.id,
			action: 'remove',
			token: window.localStorage.getItem('token'),
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


	removeAwardee (e) {
		window.bms.default.spinner.show()
		let data = {
			id: e.target.el.id,
			action: 'remove_awardee',
			token: window.localStorage.getItem('token'),
		}

		this.ReqServ.send(data).then((json) => {
			let res = JSON.parse(json)

			if( parseInt(res) > 0){
				window.location.reload()
			}

			window.bms.default.spinner.hide()
			
		}).catch(err => {
			window.bms.default.spinner.hide()
		})
	}

	removeRecepients (e) { 
		window.bms.default.spinner.show()
		let data = {
			id: e.target.el.id,
			action: 'remove',
			token: window.localStorage.getItem('token'),
		}

		this.ReqServ.removeRecepients(data).then((json) => {
			let res = JSON.parse(json)

			if(res.data){
				e.target.el.parentNode.parentNode.parentNode.parentNode.remove()
				document.getElementById('bidding-modal').close()
				// remove from DOM
				//document.getElementById(`requirements-recepients-list-${data.id}`).remove()
				window.location.reload()
				// remove from indexeedDB here
			} else {
				alert('Unable to cancel invitation. Please refresh the page and try again later.')
			}

			window.bms.default.spinner.hide()
			
		}).catch(err => {
			window.bms.default.spinner.hide()
		})
	}



	saveProposal (e) { 
		window.bms.default.spinner.show()

		const amount = document.getElementById('proposal-form-amount').value
		const discount = document.getElementById('proposal-form-discount').value
		const remarks = document.getElementById('proposal-form-remarks').value


		let original = []
		let others = []

		document.querySelectorAll('.specs-input-section-orig').forEach((el,index) => {
			const val = el.querySelector('.specs-input-section-value')

			if(val) {
				const id = val.getAttribute('data-resources')
				original.push({id, value: val.value })
			}
		})

		document.querySelectorAll('.specs-input-section-others').forEach((el, index) => {
			const name = el.querySelector('.specs-input-section-name')
			const val = el.querySelector('.specs-input-section-value')

			if (val && name) {
				others.push({name: name.value, value: val.value})
			}
		})

		let data = {
			id: window.bms.default.state.bidding.cur.requirements.id,
			amount,
			discount,
			remarks,
			original,
			others,
			token : window.localStorage.getItem('token'),
			action: 'create',
		}

		this.PropServ.send(data).then((res) => {

			const proto = Object.assign({ __proto__: this.__proto__ }, this)



			if (res > 0) {
				// update current state
				window.bms.default.state.proposals.cur.id = res
				//window.location.reload()
				document.getElementById('bidding-modal').close()
				// Notify bidders to upload formal quotation letter
				this.loadProposalAttachmentsNotice.bind(proto)()
			} else {
				alert('unable to save your proposal. Please try again later')
			}

			window.bms.default.spinner.hide()
		})
	}



	updateProposal (e) { 
		console.log(e)
		window.bms.default.spinner.show()
		const id = e.target.id
		const amount = document.getElementById('proposal-form-amount').value
		const discount = document.getElementById('proposal-form-discount').value
		const remarks = document.getElementById('proposal-form-remarks').value

		let original = []
		let others = []

		document.querySelectorAll('.specs-input-section-orig').forEach((el,index) => {
			const val = el.querySelector('.specs-input-section-value')

			if(val) {
				const id = val.getAttribute('data-resources')
				original.push({id, value: val.value })
			}
		})

		document.querySelectorAll('.specs-input-section-others').forEach((el, index) => {
			const name = el.querySelector('.specs-input-section-name')
			const val = el.querySelector('.specs-input-section-value')

			if (val && name) {
				const id = val.getAttribute('data-resources')
				others.push({id, name: name.value, value: val.value})
			}

		})

		let data = {
			id,
			amount,
			discount,
			remarks,
			original,
			others,
			otherSpecsToBeRemoved: window.bms.default.state.proposals.cur.specsToRemove,
			token : window.localStorage.getItem('token'),
			action: 'update',
		}

		this.PropServ.send(data).then((res) => {

			if (res > 0) {
				window.location.reload()
				document.getElementById('bidding-modal').close()
			} else {
				alert('unable to save your proposal. Please try again later')
			}

			window.bms.default.spinner.hide()
		})
	}


	setDeadline (e) {
		window.bms.default.spinner.show()
		let data = {
			id: window.bms.default.state.bidding.cur.requirements.id,
			deadline: document.getElementById('deadline').value,
			action: 'create',
			token: window.localStorage.getItem('token'),
		}

		this.ReqServ.deadline(data).then((json) => {
			let res = JSON.parse(json)

			if( parseInt(res) > 0){
				window.location.reload()
			} else {
				alert('Unable to set deadline. Please try again later')
			}

			window.bms.default.spinner.hide()
			
		}).catch(err => {
			window.bms.default.spinner.hide()
		})
	}

	sendPR (json) {
		// This is STATIC
		// This will changed depends upon the 3rd party endpoint
		const ProcSysURL = 'https://procsys.searca.org/api/bms/'
		return new Promise((resolve, reject) => {
			this.XHR.request({url: ProcSysURL, method: 'POST', body: JSON.stringify(json)}).then(data => {
				const parsedJson = JSON.parse(data)
				resolve(parsedJson)
			}).catch(err => {
				reject(err)
			})	
		})

	}

	getPRInfo (e) {
		const el = e.target.el
		window.bms.default.spinner.show()
		let data = {
			id: window.bms.default.state.bidding.cur.requirements.id,
			action: 'create',
			token: window.localStorage.getItem('token'),
		}

		document.querySelector('.remove-modal-section').innerHTML = '<h4>Hang on . . .</h4><small>Creating PR. Please wait . . . DO NOT close the browser while we are working on the PR</small><br/><section class="pr-status"></sectio>'
		
		const prStat = document.querySelector('.pr-status')
		
		// get proposal specs otherwise use the original specs
		if (el.getAttribute('data-proposal-id')) {
			data.id = el.getAttribute('data-proposal-id')
			this.PropServ.view(data).then(res => {
				const parsedJson = JSON.parse(res)
				const json = parsedJson[0]

				if (json.id) {

					const newData = {
						id: json.bidding_requirements_id,
						reference_no: json.id,
						company: json.company_name,
						item: json.name,
						specs: json.specs,
						price: {
							currency: json.currency,
							amount: (json.amount-json.discount),
						},
					}

					prStat.innerHTML = '<span class="text-warning">Sending to ProcSys</span>'	
					// send to ProcSys
					let sendingPRPromise = this.sendPR(newData).then(res => {
						console.log(res)
					}).catch((err) => {
						prStat.innerHTML = '<span class="text-danger">Unable to send to ProcSys. Please try again later.</span>'		
					})
					// after promise
					Promise.race([sendingPRPromise]).then(function(value) {
						window.bms.default.spinner.hide()	
					});

				} else {
					window.bms.default.spinner.hide()
					prStat.innerHTML = '<span class="text-danger">Unable to send to ProcSys. Please try again later.</span>'
				}
			})
		} else {
			this.get(data.id).then(json => {
				
				if (json.id) {
					prStat.innerHTML = '<span class="text-warning">Sending to ProcSys</span>'
					// remove unnecessary data
					if (json.awardees) delete json.awardees
					if (json.recepients) delete json.recepients
				} else {
					prStat.innerHTML = '<span class="text-danger">Unable to fetch data. Please try again later</span>'
				}
			})
		}
	}

	feedback (payload) {
		return this.ReqServ.feedback(payload)
	}

	award (e) {
		window.bms.default.spinner.show()
		let data = {
			id: e.target.el.id,
			action: 'award',
			token: window.localStorage.getItem('token'),
		}

		this.ReqServ.send(data).then((json) => {
			let res = JSON.parse(json)

			if( parseInt(res) > 0){
				window.location.reload()
			}

			window.bms.default.spinner.hide()
			
		}).catch(err => {
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
		// document.getElementById(`dropdown-req-recepients-${id}`).classList.remove('open')

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


	loadProposalAttachmentsNotice (e) {

		const URL='pages/bidding/modal/proposal-attachments-notice.html'
		const proto = Object.assign({ __proto__: this.__proto__ }, this)
		const stat = document.querySelector('#detail-req-menu-status')

		// show reload status
		stat.innerHTML = '<center style="background:#007bff;color:#fff;padding:15px;">This bidding requirement has been modified. Please reload this page to see changes <u><a href="#" class="text-danger" onclick="event.preventDefault();window.location.reload();">reload</a><u></center>'

		// close form
		document.querySelector('.prop-reg-main-dialog').classList.remove('open')

		// load notice
		return this.XHR.request({method:'GET',url:URL}).then(res=>{
			let modalTarget=document.getElementById('modal-bidding-body')
			modalTarget.innerHTML=res

			setTimeout(()=>{
				window.bms.default.scriptLoader(modalTarget)
			},50)

			// show modal with an updated content
			document.getElementById('bidding-modal').show()

			setTimeout(()=>{
				//remove cancel
				document.getElementById('modal-dialog-close-button').addEventListener('click',()=>{
		
					document.getElementById('bidding-modal').close()
					
				})

				// allow attachment
				let btn = document.getElementById('modal-dialog-send-button')
				if (!document.querySelector('.file-prop-attachment-dialog-btn')) {
					btn.classList.add('file-prop-attachment-dialog-btn')
				}
				// autoclose modal
				btn.addEventListener('click', () => {
					document.getElementById('bidding-modal').close()
				})

				window.bms.default.lazyLoad(['./assets/js_native/assets/js/modules/Invitation/Util/AttachmentsModal.js'])
			})


		}).catch(err=>{
			console.log(err)
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



	loadSaveProposal (e) {
		const URL = 'pages/bidding/modal/save-proposals.html'
		const id = 1
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

				let btn = document.getElementById('modal-dialog-send-button')
				btn.addEventListener('click', this.saveProposal.bind(proto))
			})
		}).catch(e=>{})
	}


	loadUpdateProposal (e) {
		const URL='pages/bidding/modal/save-proposals.html'
		const id = e.target.getAttribute('data-resources')
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

				let btn = document.getElementById('modal-dialog-send-button')
				btn.id = id
				btn.addEventListener('click', this.updateProposal.bind(proto))
			})
		}).catch(e=>{})
	}



	loadRemoveAwardee (e) {
		const URL='pages/suppliers/modal/remove.html'
		const id=e.target.getAttribute('data-resources')
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

				let btn = document.getElementById('modal-dialog-remove-button')
				e.target.id = id
				btn.el =  e.target
				btn.addEventListener('click', this.removeAwardee.bind(proto))
			})
		}).catch(e=>{})
	}


	loadSetDeadline (e) {
		const URL='pages/bidding/modal/deadline.html'
		const id=e.target.getAttribute('data-resources')
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

				let btn = document.getElementById('modal-dialog-remove-button')
				e.target.id = id
				btn.el =  e.target
				btn.addEventListener('click', this.setDeadline.bind(proto))
			})
		}).catch(e=>{})
	}


	loadSetPR (e) {
		const URL='pages/bidding/modal/pr.html'
		const id=e.target.getAttribute('data-resources')
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
				e.target.id = id
				btn.el =  e.target
				btn.addEventListener('click', this.getPRInfo.bind(proto))
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
		  											<li class="list-group-item "><a href="${window.bms.config.network}/bidding/requirements/attachments/download.php?id=${data.id}" target="_blank">Download</a></li>
													<li class="list-group-item"><a data-target="#bidding-modal" data-popup-toggle="open" href="#" class="remove-attachments-modal">Remove</a></li>
												<ul>
											</div>
										</div>
									</div>
								</div>`
	}

	sendRequirements (e) {
		window.bms.default.spinner.show()
		if (!window.bms.bidding.suppliersSendingListItems) window.bms.bidding.suppliersSendingListItems = {}
		let modalTarget=document.getElementById('modal-bidding-requirements-body')	
		let data = {
			id: window.bms.default.state.bidding.cur.requirements.id,
			suppliers: window.bms.bidding.suppliersSendingList,
			items: window.bms.bidding.suppliersSendingListItems,
			action: Object.keys(window.bms.bidding.suppliersSendingListItems).length > 0 ? 'send_items' : 'send',
			token: window.localStorage.getItem('token'),
		}

		const br = Object.values(window.bms.bidding.suppliersSendingList)
		let x =0;

		this.ReqServ.send(data).then((json) => {
			let res = JSON.parse(json)
			const target = document.querySelector('.attachment-recepients-section')

			if(res.data){

				for(let val in res.data) {

					const html = document.createElement('div')
					html.classList.add('col-lg-2', 'col-md-2')
					html.setAttribute('style', 'padding:5px;background:#393f45;border:1px solid #fefefe;color:#fff;')
					html.id = `requirements-recepients-list-${val}`
					html.innerHTML = `<div class="d-flex align-items-stretch">
										<div class="col-9">
											<div style="float:left;width:100%;max-height:30px;overflow:hidden;text-overflow:ellipsis;">${br[x]}</div>
										</div>

										<div class="col-1">
											<i class="material-icons md-18 device-dropdown" data-device-dropdown="dropdown-req-recepients-${val}" data-resources="2">arrow_drop_down</i>
											<div class="dropdown-section float-right" id="dropdown-req-recepients-${val}">
												<ul class="list-group list-group-flush">
													<li class="list-group-item"><a data-target="#bidding-modal" data-popup-toggle="open" href="#" class="remove-receipients-modal" data-resources="${res.data[val]}">Cancel Invitation</a></li>
													<li class="list-group-item"><a href="${window.bms.config.network}/bidding/reports/price_inquiry_per_item.php?id=${res.data[val]}&token=${data.token}" target="_blank" data-resources="${res.data[val]}"><i class="material-icons md-18">print</i> Price Inquiry</a></li>
													<li class="list-group-item"><a href="${window.bms.config.network}/bidding/reports/price_inquiry_per_item.php?id=${res.data[val]}&token=${data.token}" target="_blank" data-resources="${res.data[val]}"><i class="material-icons md-18">print</i> Price Inquiry (All)</a></li>
						
												<ul>
											</div>
										</div>
									</div>`
					target.append(html)
					x++
				}
				
				// e.target.el.parentNode.parentNode.parentNode.parentNode.remove()
				document.getElementById('bidding-requirements-modal').close()

				setTimeout(() => {
						// dropdown
						window.bms.default.dropdown('device-dropdown')
						// enable popup
						const PopupInstance = new PopupES()
						this.bindRemoveRecepients()
				},1000)


			} else {
				// show error
				modalTarget.innerHTML = `
				<center style="margin-bottom:10px;margin-top:20px;" class="col-12">
					<h2>Oops something went wrong!</h2>
					<p class="text-danger">Please make sure that you set the deadline before sending an invitation</p>
				</center>`;
			}

			window.bms.default.spinner.hide()
			
		}).catch(err => {
			// show error
			modalTarget.innerHTML = `
			<center style="margin-bottom:10px;margin-top:20px;" class="col-12">
				<h2>Oops something went wrong!</h2>
				<p class="text-danger">Please make sure that you set the deadline before sending an invitation</p>
			</center>`;
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

	loadSendRequirementsSelected (e) {
		const URL='pages/bidding/modal/send-requirements-item.html'
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

	loadAwardRequirementsAttachmentsNotice (e) {

		const URL='pages/bidding/modal/award-attachments-notice.html'
		const proto = Object.assign({ __proto__: this.__proto__ }, this)
		const stat = document.querySelector('#detail-req-menu-status')

		// show reload status
		stat.innerHTML = '<center style="background:#007bff;color:#fff;padding:15px;">This bidding requirement has been modified. Please reload this page to see changes <u><a href="#" class="text-danger" onclick="event.preventDefault();window.location.reload();">reload</a><u></center>'


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

				btn.addEventListener('click', () => {
					// close modal then open the attachment sidebar
					document.getElementById('bidding-requirements-modal').close()
					document.querySelector('.file-attachment-requirement-dialog-btn').click()
				})
			})


		}).catch(err=>{
			console.log(err)
		})
	}

	winnerRequirements (e) {
		let modalTarget=document.getElementById('modal-bidding-requirements-body')
		window.bms.default.spinner.show()
		let data = {
			id: window.bms.default.state.bidding.cur.requirements.id,
			suppliers: window.bms.bidding.suppliersSendingList,
			remarks: document.getElementById('remarks').value ,
			action: 'winner',
			token: window.localStorage.getItem('token'),
		}

		this.ReqServ.send(data).then((json) => {
			const proto = Object.assign({ __proto__: this.__proto__ }, this)
			let res = JSON.parse(json)

			if( parseInt(res) > 0){
				//window.location.reload()
				// notify user to upload attachmet
				this.loadAwardRequirementsAttachmentsNotice().bind(proto)

			} else {
				// show error
				modalTarget.innerHTML = `
				<center style="margin-bottom:10px;margin-top:20px;" class="col-12">
					<h2>Oops something went wrong!</h2>
					<p class="text-danger">Please make sure that you set the deadline before sending an invitation</p>
				</center>`;
			}

			window.bms.default.spinner.hide()
			
		}).catch(err => {
			window.bms.default.spinner.hide()
			// show error
			modalTarget.innerHTML = `
				<center style="margin-bottom:10px;margin-top:20px;" class="col-12">
					<h2>Oops something went wrong!</h2>
					<p class="text-danger">Please make sure that you set the deadline before sending an invitation</p>
				</center>`;
		})
	}

	loadWinnerRequirements (e) {
		const URL='pages/bidding/modal/winner.html'
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
				btn.addEventListener('click', this.winnerRequirements.bind(proto))
			})
		}).catch(e=>{})
	}

	loadAwardRequirements (e) {
		const URL='pages/bidding/modal/award-proposal.html'
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
				btn.addEventListener('click', this.award.bind(proto))
			})
		}).catch(e=>{})
	}
	


	


	bindSendRequirements () {
		const proto = Object.assign({ __proto__: this.__proto__ }, this)
		document.querySelectorAll('.send-requirements-modal-btn').forEach((val, index) => {
			val.addEventListener('click',this.loadSendRequirements.bind(proto))
		})
	}

	bindSendRequirementsPerItem () {
		const proto = Object.assign({ __proto__: this.__proto__ }, this)
		document.querySelectorAll('.send-requirements-selected-modal-btn').forEach((val, index) => {
			val.addEventListener('click',this.loadSendRequirementsSelected.bind(proto))
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
		/*document.querySelector('.requirements-proposal-link').href = `#/bids/requirements/${id}/proposal/form`
		// handler
		document.querySelectorAll('.proposal-requirement-dialog-btn').forEach((el, index) => {
			el.addEventListener('click', () => {
				// show/hide section
				document.querySelector('[name="/bids/info/particulars/proposals"]').classList.toggle('hide')

			})
		})*/
	}

	bindSendProposal () {
		const proto = Object.assign({ __proto__: this.__proto__ }, this)
		document.querySelectorAll('.send-bidding-modal-btn').forEach((val, index) => {
			val.addEventListener('click',this.loadSendProposal.bind(proto))
		})
	}

	bindSaveProposal () {
		const proto = Object.assign({ __proto__: this.__proto__ }, this)
		document.querySelectorAll('.save-bidding-modal-btn:not(.event-binded)').forEach((val, index) => {
			val.classList.add('event-binded')
			val.addEventListener('click',this.loadSaveProposal.bind(proto))
		})
	}

	bindUpdateProposal () {
		const proto = Object.assign({ __proto__: this.__proto__ }, this)
		document.querySelectorAll('.save-bidding-modal-btn').forEach((val, index) => {
			val.addEventListener('click',this.loadUpdateProposal.bind(proto))
		})
	}


	bindSetWinner () {
		const proto = Object.assign({ __proto__: this.__proto__ }, this)
		document.querySelectorAll('.award-requirements-modal-btn').forEach((val, index) => {
			val.addEventListener('click',this.loadWinnerRequirements.bind(proto))
		})
	}


	bindRemoveAwardee () {
		const proto = Object.assign({ __proto__: this.__proto__ }, this)
		document.querySelectorAll('.remove-awardees-modal').forEach((val, index) => {
			val.addEventListener('click',this.loadRemoveAwardee.bind(proto))
		})
	}

	bindSetDeadline () {
		const proto = Object.assign({ __proto__: this.__proto__ }, this)
		document.querySelectorAll('.set-deadline-modal-btn').forEach((val, index) => {
			val.addEventListener('click',this.loadSetDeadline.bind(proto))
		})
	}

	bindSetPR () {
		const proto = Object.assign({ __proto__: this.__proto__ }, this)
		document.querySelectorAll('.pr-awardees-modal:not(.event-binded)').forEach((val, index) => {
			val.classList.add('event-binded')
			val.addEventListener('click',this.loadSetPR.bind(proto))
		})
	}

	bindAward () {
		const proto = Object.assign({ __proto__: this.__proto__ }, this)
		document.querySelectorAll('.award-list-modal-btn').forEach((val, index) => {
			val.addEventListener('click',this.loadAwardRequirements.bind(proto))
		})
	}



}