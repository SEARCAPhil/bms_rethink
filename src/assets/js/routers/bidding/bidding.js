import { AttachmentsReq } from '../../modules/Bidding/Util/Attachments/Requirements'
import IndexUtilities from '../../modules/Bidding/Util/Index/Index'
import InfoUtilities from '../../modules/Bidding/Util/Info'
import IndexedDB from '../../modules/Bidding/Util/Storage/Bidding'
import IndexedDBReq from '../../modules/Bidding/Util/Storage/Requirements'
import PopupES from '../../Components/PopupES/PopupES'
import RequirementsUtilities from '../../modules/Bidding/Util/Requirements'


const appRoute = new window.bms.exports.Router('http://127.0.0.1/bms_rethink/www/',true)
const IDB = new IndexedDB()
const IDBReq = new IndexedDBReq()
const IndexUtil = new IndexUtilities()
const InfoUtil = new InfoUtilities()
const AttUtil = new AttachmentsReq()
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
	const recSection = document.querySelector('#funds-requirements-info-section')

	recSection.innerHTML += `	<span class="badge badge-dark">${data.type} - ${data.cost_center}  - ${data.line_item}</span> &nbsp;`
}


const appendAwardees = (data) => {
	const recSection = document.querySelector('#awardees-section-list')

	recSection.innerHTML += `	<details class="text-success col-12 row">
				    			<summary> <i class="material-icons md-18">card_membership</i> ${data.name}   </summary>
				    			<br/>
				    			
				    				
				    				<p class="col-12">
				    					<a href="#" data-target="#bidding-requirements-modal" data-popup-toggle="open" class="text-danger" data-resources="${data.id}">Remove</a> &emsp;
				    					<br/>
				    					${data.remarks}
				    				</p>
				    			<br/>
				    		</details>`
}

const loadRequirementsDetails = (json) => {
	const targ = document.querySelector('.specs-section-info')
	const attTarg = document.getElementById('attacments-requirements-info-section')

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

	// recepients
	json.funds.forEach((val, index) => {
		appendReqFunds({type: val.fund_type, cost_center:val.cost_center, line_item: val.line_item })
	})


	// recepients
	json.awardees.forEach((val, index) => {
		appendAwardees({name : val.name, id: val.id, remarks: val.remarks })
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
			ReqUtil.bindAward()

			// send
			ReqUtil.bindRemoveRecepients()

			// show proposals
			ReqUtil.bindShowProposalSection(json.id)

	},10)

	console.log(json)

		// show all menus ONLY for OPEN Bidding Request
	setTimeout(() => {
		window.bms.default.showAllMenuForOpen (json.bidding_status == 0) 
		// for CBA Asst /APPROVE
		window.bms.default.showAllMenuForOpen (json.bidding_status == 1 && window.bms.default.isCBAAsst()) 

		// for both
		// must change to send to resend
		window.bms.default.showAllMenuForOpen (json.bidding_status == 2)

		// GSU
		window.bms.default.showAllMenuForOpen (json.bidding_status == 3 && window.bms.default.isGSU()) 

			

	},800)



}

appRoute.on({
 	'/*': () => {
 		// this is required to always treat suppliers as separate route
 		// without this, link will stop working after a few clicks
 	},
	'/bids/*': () => {
		IndexUtil.loadBiddingListSection()
		IndexUtil.loadBiddingInitialPage()
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
		IndexUtil.loadBiddingRequirementsInfo()
		IndexUtil.loadBiddingListSection()

		window.bms.default.lazyLoad(['./assets/js_native/assets/js/modules/bidding/Util/Attachments/RequirementsModal.js'])

		ReqUtil.get(params.id).then(json => {
			if (json.id) {
				loadRequirementsDetails(json)
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
		window.bms.default.spinner.show()
		window.bms.default.changeDisplay(['div[name="/bids/initial"]','div[name="/bids/forms/registration/2"]', 'div[name="/bids/forms/registration"]', 'div[name="/bids/forms/registration/3"]', 'div[name="/bids/info"]', 'div[name="/bids/info"]','[name="/bids/info/particulars/details"]'],'none')
		window.bms.default.changeDisplay(['[name="/bids/info/particulars"]', '[name="/bids/info/particulars/proposals/form"]'],'block')

		const target = document.querySelector('[name="/bids/info/particulars/proposals/form"]')
		

		ReqUtil.loadProposalForm().then(() => {
			const section = document.querySelector('.specs-section-proposal')

			window.bms.default.spinner.hide()
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
		}) 

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