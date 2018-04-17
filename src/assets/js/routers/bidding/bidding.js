import { AttachmentsReq } from '../../modules/Bidding/Util/Attachments/Requirements'
import IndexUtilities from '../../modules/Bidding/Util/Index/Index'
import InfoUtilities from '../../modules/Bidding/Util/Info'
import IndexedDB from '../../modules/Bidding/Util/Storage/Bidding'
import IndexedDBReq from '../../modules/Bidding/Util/Storage/Requirements'
import PopupES from '../../Components/PopupES/PopupES'
import ProposalService from '../../modules/Invitation/Services/Proposal'
import RequirementsUtilities from '../../modules/Bidding/Util/Requirements'



const appRoute = new window.bms.exports.Router('http://127.0.0.1/bms_rethink/www/',true)
const IDB = new IndexedDB()
const IDBReq = new IndexedDBReq()
const IndexUtil = new IndexUtilities()
const InfoUtil = new InfoUtilities()
const AttUtil = new AttachmentsReq()
const PropServ = new ProposalService ()
const ReqUtil = new RequirementsUtilities()

window.bms.default.pages = []
window.bms.default.spinner = new window.bms.exports.Spinner({
	target:'body',
	class:'spinner'
})

let PopupInstance = {}


const loadCSS = (href) => {
	let css = document.createElement('link')
	css.type= 'text/css'
	css.rel = 'stylesheet'
	css.href = href
	document.body.append(css)
}

const appendReqAttachments = (data) => {
	const attSec = document.getElementById('attachments-requirements-info-section')
	attSec.innerHTML += `	<div class="col-lg-3 col-md-3" style="padding:5px;background:#505050;color:#fff;border:1px solid #fefefe;">
								<div class="d-flex align-items-stretch">
									<div class="col-10">
										<div class="file-icon file-icon-sm" data-type="${data.type}"></div> ${data.original_filename}
									</div>

									<div class="col-2">
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

const appendReqRecepients = (data) => {
	const recSection = document.querySelector('.attachment-recepients-section')

	recSection.innerHTML += `	<div class="col-lg-2 col-md-2" style="padding:5px;background:#393f45;border:1px solid #fefefe;color:#fff;" id="requirements-recepients-list-${data.id}">
								<div class="d-flex align-items-stretch">
									<div class="col-9">
										<div style="float:left;width:100%;max-height:30px;overflow:hidden;text-overflow:ellipsis;">${data.name}</div>
									</div>

									<div class="col-1">
										<i class="material-icons md-18 device-dropdown" data-device-dropdown="dropdown-req-recepients-${data.id}" data-resources="${data.id}">arrow_drop_down</i>
										<div class="dropdown-section float-right" id="dropdown-req-recepients-${data.id}">
											<ul class="list-group list-group-flush">
												<li class="list-group-item"><a data-target="#bidding-modal" data-popup-toggle="open" href="#" class="remove-receipients-modal" data-resources="${data.id}">Cancel Invitation</a></li>
											<ul>
										</div>
									</div>
								</div>
							</div>`
}

const appendReqFunds = (data) => {
	let recSection = document.querySelector('#funds-requirements-info-section')

	recSection.innerHTML += `	<span class="badge badge-dark">${data.type} - ${data.cost_center}  - ${data.line_item}</span> &nbsp;`
}


const appendAwardees = (data) => {
	let recSection = document.querySelector('#awardees-section-list')
	let html =	`<details class="col-12 row" open>
				    			<summary class="text-success"> <i class="material-icons md-18">card_membership</i> ${data.name}   </summary>
				    			<br/>`
				    			
		if (data.proposal_id) {				
			html += `<p class="col-12">
				    					<a href="#" data-target="#bidding-requirements-modal" data-popup-toggle="open" class="btn btn-danger btn-sm pr-awardees-modal" data-resources="${data.id}"> 
				    						<i class="material-icons md-18">receipt</i> Submit PR</a> &emsp;
				    				</p>`
		} else {
			html += `<p class="col-12">
				    					<a href="#" data-target="#bidding-requirements-modal" data-popup-toggle="open" class="text-danger remove-awardees-modal" data-resources="${data.id}"> 
				    						<i class="material-icons md-18">delete_forever</i> Remove</a> &emsp;
				    				</p>`
		}

	html += `		<p class="col-12 text-muted">${data.remarks}</p>
				    			<br/>
				    		</details>`
	recSection.innerHTML = html
}

const showAwardedStatus = () => {
	let targ = document.getElementById('detail-req-menu-status')
	targ.innerHTML = `
	<style>
		.congrats-banner {
   			display: block;
			position:relative;
			z-index:0;
		}
		.congrats-banner:after {
			content: '';
			position: absolute;
			top: 0;
			right: 0;
			bottom:0;
			left: 0;
			background:url('assets/img/confetti.png') repeat center;
			z-index:-1;
			opacity:0.15;
		}
	</style>
	<center style="background:#464a4e;color:#fff;padding:5px;" class="congrats-banner">
						<p class="col-12">
							<i class="material-icons" style="color:#ffb80c;">star</i> This has been awarded. Please review before making any changes.
				        </p>
				    </center>`
}

const loadRequirementsDetails = (json) => {
	let targ = document.querySelector('.specs-section-info')
	let attTarg = document.getElementById('attacments-requirements-info-section')

	document.querySelector('.req-name').textContent = json.name
	document.querySelector('.req-reference-number').textContent = json.id
	document.querySelector('.req-currency').textContent = json.budget_currency
	document.querySelector('.req-amount').textContent = json.budget_amount
	document.querySelector('.req-quantity').textContent = json.quantity
	document.querySelector('.req-unit').textContent = json.unit
	document.querySelector('.req-deadline').innerHTML = `<span class="text-danger">${json.deadline != '0000-00-00' ? json.deadline : 'Not Set'}</span>`
	document.querySelector('.back-to-bidding-btn').href = `#/bids/${json.bidding_id}/info`

	json.specs.forEach((val, index) => {
		targ.innerHTML += `
			<div class="col-2">
	    		<b>${val.name}</b>
	    	</div>
	    	<div class="col-10">
	    		<p>${val.value}</p>
	    	</div>
		`
	})

	json.attachments.forEach((val, index) => {
		appendReqAttachments({type: val.type, original_filename: val.original_filename, id: val.id })
	})

	// recepients
	json.recepients.forEach((val, index) => {
		appendReqRecepients({name: val.name, id: val.id })
	})

	// recepients
	json.funds.forEach((val, index) => {
		appendReqFunds({type: val.fund_type, cost_center:val.cost_center, line_item: val.line_item })
	})


	// awardees
	json.awardees.forEach((val, index) => {
		appendAwardees({name : val.name, id: val.id, remarks: val.remarks, proposal_id: val.proposal_id })
	})

	// awrded banner
	if (json.awardees.length > 0) {
		document.getElementById('awardees-section').classList.remove('hide')
		showAwardedStatus()
	}


	setTimeout(() => {
			// dropdown
			window.bms.default.dropdown('device-dropdown')
			// enable popup
			PopupInstance = new PopupES()
			// remove attachments
			AttUtil.bindRemoveAttachments()
			// send
			ReqUtil.bindSendRequirements()
			// send
			ReqUtil.bindSendRequirementsPerItem()
			// award
			ReqUtil.bindAward()
			// cancel invitation
			ReqUtil.bindRemoveRecepients()
			// show proposals
			ReqUtil.bindShowProposalSection(json.id)
			// awardees
			ReqUtil.bindRemoveAwardee()
			// deadline
			ReqUtil.bindSetDeadline()


	},10)

	

		// show all menus ONLY for OPEN Bidding Request
	setTimeout(() => {

		window.bms.default.showAllMenuForOpen (json.bidding_status == 0) 

		// for CBA Asst /APPROVE
		window.bms.default.showAllMenuForOpen (json.bidding_status == 1 && window.bms.default.isCBAAsst()) 

		// for both
		// must change to send to resend
		window.bms.default.showAllMenuForOpen (json.bidding_status == 2)

		// if Approved
		window.bms.default.showAllMenuForOpen (json.bidding_status == 3) 

		// GSU
		if (window.bms.default.isGSU() && json.bidding_status == 3) {
			document.querySelector('.send-requirements-group').classList.remove('hide')
			document.querySelector('.set-deadline-modal-btn').classList.remove('hide')
		}

		if (window.bms.default.isCBAAsst() && json.bidding_status == 3) {
			document.querySelector('.award-requirements-modal-btn').classList.remove('hide')
		}

			

	},800)



}

const addOtherSpecsField = () => {
	let targ = document.getElementById('specs-other-section')

	let sec = document.createElement('section')

	sec.innerHTML = `
		<span class="row specs-input-section specs-input-section-others " style="margin-top: 15px;">
			 <div class="col-lg-4 col-md-4">
		    	<input type="text" class="other-req-name-fields specs-input-section-name form-control" placeholder="name"/>
		    </div>
		    <div class="col-lg-8 col-md-8">
		    	<input type="text" class="other-req-value-fields specs-input-section-value form-control" placeholder="value"/>
		    	<small class="orig-req-menu">
		    		<a href="#" onclick="event.preventDefault();this.parentNode.parentNode.parentNode.remove()">remove</a>
		    	</small>
		    </div>

		</span>
	`

	targ.append(sec)

}

const cancelSpecsInput = (e) => {
	const val = e.target.value
	const id = e.target.id

	let targ = document.getElementById(`orig-req-val-${id}`)
	targ.innerHTML = val

	// change link
	let btn = document.createElement('a')
	btn.href = '#'
	btn.setAttribute('onclick', 'event.preventDefault()')
	btn.setAttribute('data-resources', id)
	btn.setAttribute('data-resources-val', val)
	btn.textContent = 'change'
	btn.addEventListener('click', changeEventSpecsInput)

	e.target.replaceWith(btn)
}

const changeEventSpecsInput = (e) => {
	const id = e.target.getAttribute('data-resources')
	const origValue = e.target.getAttribute('data-resources-val')
	const origEl = e.target



	let targ = document.getElementById(`orig-req-val-${id}`)
	targ.innerHTML = `<input type="text" style="width:250px;" placeholder="${origValue}" class="specs-input-section-value" data-resources="${id}"/>`

	let link = document.createElement('a')
	link.href = '#'
	link.setAttribute('onclick','event.preventDefault();')
	link.textContent = 'cancel'
	link.id = id
	link.value = origValue
	link.setAttribute('data-resources', id)
	link.setAttribute('data-resources-val', origValue)
	link.addEventListener('click', cancelSpecsInput)
	
	e.target.replaceWith(link)
}

appRoute.on({
 	'/*': () => {
 		// this is required to always treat suppliers as separate route
 		// without this, link will stop working after a few clicks
 	},
	'/bids/*': () => {
		IndexUtil.loadBiddingListSection()
		// for all users except supplier
		// supplier must only see a welcome page
		//if (window.bms.default.isGSU() || window.bms.default.isCBAAsst() || window.bms.default.isStandard()) {
			IndexUtil.loadBiddingInitialPage()
		//} else {
			//IndexUtil.loadBiddingInitialStandardPage()
		//}
		
		loadCSS('assets/css/modules/suppliers/list.css')
	},
	'/bids/:id/info/': (params) => {
		window.bms.default.state.bidding.cur.bid.id = params.id
		window.bms.default.changeDisplay(['div[name="/bids/initial"]','div[name="/bids/forms/registration/2"]','div[name="/bids/forms/registration"]','div[name="/bids/forms/registration/3"]', '[name="/bids/info/particulars/proposals/form"]'],'none')
		window.bms.default.changeDisplay(['div[name="/bids/info/particulars/details"]'],'block')
		
		IndexUtil.loadBiddingInfo({id: params.id, status: 1}).then(() => {
			setTimeout(() => {
				InfoUtil.bindRemoveBidding()
				InfoUtil.bindSendBidding()
				InfoUtil.bindSetStatus()
				InfoUtil.bindChangeSignatories()
			},600)
		})

		document.querySelectorAll(`.list`).forEach((el, index) => {
			if (el.getAttribute('data-list')==params.id) {
				el.classList.add('active')
			} else {
				el.classList.remove('active')
			}
		})
		/*IDB.get(params.id).then((json) => {	
		
			// get bidding information
			IndexUtil.loadBiddingInfo({id: params.id, status: json.status}).then(() => {
				
				document.dispatchEvent(new CustomEvent('biddingInfoChange', {detail: [json]}))
				// TODO : include script in other js to lessen file size
				// however additional XHR is required
				setTimeout(() => {
					InfoUtil.bindRemoveBidding()
					InfoUtil.bindSendBidding()
					InfoUtil.bindSetStatus()
				},600)
			}).catch((err) => {
				console.log(err)
			})
		}).catch(err => {

		})*/
		// show particulars
		IndexUtil.loadBiddingParticulars(params.id)
		IndexUtil.loadBiddingListSection()


		// load external css
		loadCSS('assets/css/modules/suppliers/list.css')
		loadCSS('assets/css/fileicon.css')
	},
	'/bids/requirements/:id': (params) => {
		window.bms.default.spinner.show()

		window.bms.default.state.bidding.cur.requirements.id = params.id
		window.bms.default.changeDisplay(['[name="/bids/info/particulars/details"]'],'block')
		window.bms.default.changeDisplay(['div[name="/bids/initial"]','div[name="/bids/forms/registration/2"]','div[name="/bids/forms/registration"]', 'div[name="/bids/forms/registration/3"]', 'div[name="/bids/info"]', '[name="/bids/info/particulars/proposals/form"]'],'none')
		IndexUtil.loadBiddingRequirementsInfo().then(() => {
			// dropdown
			window.bms.default.dropdown('device-dropdown')
		})

		IndexUtil.loadBiddingListSection()

		window.bms.default.lazyLoad(['./assets/js_native/assets/js/modules/Bidding/Util/Attachments/RequirementsModal.js'])

		ReqUtil.get(params.id).then(json => {
			if (json.id) {
				// bidding info
				window.bms.default.state.bidding.cur.bid.id = json.bidding_id
				// requirements info
				loadRequirementsDetails(json)
				// proposals
				PropServ.lists({id: params.id, token : window.localStorage.getItem('token'), id:params.id}).then((data) => {
					const json = JSON.parse(data)
					let targ = document.querySelectorAll('.proposal-list-section > ul')


					targ.forEach((el, index) => {
						// clear proposal list section
						el.innerHTML =''
					})

					setTimeout(() => {

						// number of proposals
						document.querySelector('.req-proposal-count').textContent = json.length

						targ.forEach((el, index) => {

							

							json.forEach((val, index) => {
								let html = document.createElement('li')
								let status = ''
								html.classList.add('nav-item', 'col-12')
								html.setAttribute('data-resources', val.id)
								html.style = 'border-bottom:1px solid #ccc;padding-top:5px;padding-bottom: 5px;'
								//html.setAttribute('onclick','event.preventDefault();')
								html.id = val.id

								

								if (val.status == 0) {
									status = `<br/><span class="text-danger" data-resources="${val.id}"><i class="material-icons md-12">drafts</i> DRAFT</span>`
								}

								if (val.status == 1) {
									status = `<br/><span class="text-success" data-resources="${val.id}"><i class="material-icons md-12">check</i> Sent</span>`
								}

								if (val.status == 2) {
									status = `<br/><span class="text-danger" data-resources="${val.id}"><i class="material-icons md-12">warning</i> Requesting changes</span>`
								}

								if (val.status ==3) {
									status = `<br/><span data-resources="${val.id}" style="color:#ffb80c;"><i class="material-icons">star</i> AWARDED</span>`
								}

								html.innerHTML = `
													
				                                    <a href="#" class="proposal-dialog-btn row" data-resources="${val.id}" onclick="event.preventDefault();">

				                                        <div class="col-3"  data-resources="${val.id}">
				                                            <div class="text-center" data-resources="${val.id}" style="float:left;width:35px;height:35px;border-radius:50%;margin-right:10px;overflow:hidden;background:#42403c;color:#fff;padding-top:5px" id="image-header-section"  data-resources="${val.id}">${val.username.substr(0,2).toUpperCase()}</div>
				                                        </div>
				                                        <div class="col-9"  data-resources="${val.id}">
				                                                <small data-resources="${val.id}">
				                                                    <p data-resources="${val.id}">
				                                                        ${val.username}<br/>
				                                                        <span class="text-muted">${val.date_created}</span>
				                                                        ${status}
				                                                    </p>
				                                                </small>
				                                        </div>
				                                    </a>
				                                    <div class="row col-12"  data-resources="${val.id}">
				                                    	<input type="checkbox" name="compare" class="compare-checkbox-list ${val.status}" data-resources="${val.id}"/> &nbsp; <small class="text-muted"> #${val.id}</small>
				                                    </div>

				                           `
				                // insert to DOM
				                el.append(html)
				               
							})
						})

						let checkbox = document.getElementById('compare-checkbox')

						checkbox.addEventListener('click', (e) => {
							document.querySelectorAll('.compare-checkbox-list').forEach((el, index) => {
								// exclude proposals that need changes
								if (!el.classList.contains('2')) {	
									e.target.checked ? el.checked = true : el.checked = false
								}
							})
						})

						// compare
						let compareBtn = document.getElementById('compare-btn')
						
						compareBtn.addEventListener('click' , () => {
							// get all selected checkbox
							let ids = []
							document.querySelectorAll(`.compare-checkbox-list:checked`).forEach((el, index) => {
								const atr = el.getAttribute('data-resources')
								if (!ids[atr]) ids.push(atr)
							})


							window.open(`${window.bms.config.network}/bidding/reports/proposal_comparison.php?id=${params.id}&token=6170b5207b92e5a7445ee3f7de7247c4c1f1b8ef&prop=${ids.join(',')}`)
						})

						window.bms.default.lazyLoad(['./assets/js_native/assets/js/modules/Invitation/Util/ProposalModal.js'])
					},600)
				})

			}
			window.bms.default.spinner.hide()
		}).catch((err) => {
			window.bms.default.spinner.hide()
		})

		// get requirements
		/*IDBReq.get(params.id).then((json) => {
			if (json.id) {
				document.querySelector('.req-name').textContent = json.name
				document.querySelector('.req-currency').textContent = json.budget_currency
				document.querySelector('.req-amount').textContent = json.budget_amount
				document.querySelector('.req-quantity').textContent = json.quantity
				document.querySelector('.req-unit').textContent = json.unit

				json.specs.forEach((val, index) => {
					targ.innerHTML += `
						<div class="col-2">
				    		<b>${val.name}</b>
				    	</div>
				    	<div class="col-10">
				    		<p>${val.value}</p>
				    	</div>
					`
				})

				json.attachments.forEach((val, index) => {
					appendReqAttachments({type: val.type, original_filename: val.original_filename, id: val.id })
				})

				// recepients
				json.recepients.forEach((val, index) => {
					appendReqRecepients({name: val.name, id: val.id })
				})

				setTimeout(() => {
						// dropdown
						window.bms.default.dropdown('device-dropdown')
						// enable popup
						PopupInstance = new PopupES()
						// remove attachments
						AttUtil.bindRemoveAttachments()

						// send
						ReqUtil.bindSendRequirements()

						// send
						ReqUtil.bindRemoveRecepients()

						// show proposals
						ReqUtil.bindShowProposalSection(params.id)
				},10)

			}
		})*/

		loadCSS('assets/css/modules/suppliers/list.css')
		loadCSS('assets/css/fileicon.css')
	},
	'/bids/requirements/:id/proposal/form': (params) => {
		window.bms.default.state.bidding.cur.requirements.id = params.id
		window.bms.default.spinner.show()
		window.bms.default.changeDisplay(['div[name="/bids/initial"]','div[name="/bids/forms/registration/2"]', 'div[name="/bids/forms/registration"]', 'div[name="/bids/forms/registration/3"]', 'div[name="/bids/info"]', 'div[name="/bids/info"]','[name="/bids/info/particulars/details"]'],'none')
		window.bms.default.changeDisplay(['[name="/bids/info/particulars"]', '[name="/bids/info/particulars/proposals/form"]'],'block')

		const target = document.querySelector('[name="/bids/info/particulars/proposals/form"]')
		

		/*ReqUtil.loadProposalForm().then(() => {
			const section = document.querySelector('.specs-section-proposal')

			window.bms.default.spinner.hide()

				ReqUtil.get(params.id).then(json => {
					if (json.id) {
						document.querySelector('.req-form-name').textContent = json.name
						// change unit & quantity
						document.querySelector('.req-quantity-reg').textContent = json.quantity
						document.querySelector('.req-unit-reg').textContent = json.unit

						// clear
						section.innerHTML = ''

						// specs
						json.specs.forEach((val, index) => {
							let html = document.createElement('span')
							html.classList.add('row', 'specs-input-section', 'specs-input-section-orig')
							html.setAttribute('data-resources', json.id)
							html.setAttribute('style', 'margin-top: 15px;')
							html.innerHTML = `
								 <div class="col-lg-3 col-md-3" id="orig-req-name-${val.id}" class="orig-req-name">
							    	<b>${val.name}</b>
							    </div>
							    <div class="col-lg-9 col-md-9">
							    	<span id="orig-req-val-${val.id}" class="orig-req-val" data-resources-val="${val.value}">${val.value}</span>
							    	<small class="orig-req-menu"></small>
							    </div>

							`

							// change link
							let btn = document.createElement('a')
							btn.href = '#'
							btn.setAttribute('onclick', 'event.preventDefault()')
							btn.setAttribute('data-resources', val.id)
							btn.setAttribute('data-resources-val', val.value)
							btn.textContent = 'change'
							btn.addEventListener('click', changeEventSpecsInput)

							html.querySelector('.orig-req-menu').append(btn)

							section.append(html)
						})

						// bind other specs
						const otherSpecsBtn = document.querySelector('.add-other-specs-btn')
						otherSpecsBtn.addEventListener('click', addOtherSpecsField)

						setTimeout(() => {
							// enable popup
							const pop = new window.bms.exports.PopupES()
						
							// show proposals
							ReqUtil.bindSendProposal()
							ReqUtil.bindSaveProposal()
						},10)
					}
				})
			// get requirements
			/*IDBReq.get(params.id).then((json) => {
				if (json.id) {
					// change unit & quantity
					document.querySelector('.req-quantity-reg').textContent = json.quantity
					document.querySelector('.req-unit-reg').textContent = json.unit

					// clear
					section.innerHTML = ''

					// specs
					json.specs.forEach((val, index) => {
						let html = document.createElement('span')
						html.classList.add('row', 'specs-input-section')
						html.setAttribute('data-resources', json.id)
						html.setAttribute('style', 'margin-top: 15px;')
						html.innerHTML = `
							 <div class="col-lg-3 col-md-3">
						    	<b>${val.name}</b>
						    </div>
						    <div class="col-lg-9 col-md-9">
						    	<span>${val.value}</span>
						    	<small><a href="#" onclick="event.preventDefault()">change</a></small>
						    </div>

						`
						section.append(html)
					})

					setTimeout(() => {
						// enable popup
						const pop = new window.bms.exports.PopupES()
					
						// show proposals
						ReqUtil.bindSendProposal()
					},10)

				}
			})*/
		//}) 

		// load list if not exists
		IndexUtil.loadBiddingListSection()
		loadCSS('assets/css/modules/suppliers/list.css')

		
	},
	'/bids/forms/registration/*': (params) => {
		IndexUtil.loadBiddingListSection()
		window.bms.default.lazyLoad(['./assets/js_native/assets/js/routers/bidding/registration.js'],{once:true})
		loadCSS('assets/css/modules/suppliers/list.css')

	}
}).resolve()