import ProposalDialog from '../../../components/ProposalDialog/Dialog'
import ProposalService from '../../../modules/Invitation/Services/Proposal'
import ProposalUtil from '../../../modules/Invitation/Util/Info'
import { Attachments } from '../../../modules/Invitation/Util/Attachments'


const PropServ = new ProposalService ()
const PropUtil = new ProposalUtil ()
const AttUtil = new Attachments()



const showSent = () => {
	let targ = document.getElementById('prop-info-menu-status')

	targ.innerHTML = `<center style="background:#464a4e;color:#fff;padding:5px;">
								<p class="col-12">
									<i class="material-icons">share</i> This proposal has been sent. You cannot change your proposal any longer.
						        </p>
						    </center>`
}


const showReceived = (id) => {
	let targ = document.getElementById('prop-info-menu-status')

	targ.innerHTML = `<center style="background:#464a4e;color:#fff;padding:5px;">
								<p class="col-12">
									<i class="material-icons">share</i> You have received this proposal. Please review all the details before doing any further actions.

									<a class="award-prop-modal-btn btn btn-sm btn-danger" data-resources="${id}" data-target="#bidding-requirements-modal" data-popup-toggle="open">
										<i class="material-icons md-18">card_membership</i> Award
									</a>

						        </p>
						    </center>`
	setTimeout(() => {
		const popupInstance = new window.bms.exports.PopupES()
		// award
		PropUtil.bindAward()

	},400)
}


const showNeedChanges = (remarks = '') => {
	let targ = document.getElementById('prop-info-menu-status')

	targ.innerHTML = `<section style="background:#dc3545;color:#ececec;padding:5px;" class="">
								<p class="col-12">
									<details>
										<summary><i class="material-icons md-18">warning</i> Your proposal needs changes Find out why ?</summary><br/>
										<p>${remarks}</p>
									</details>
						        </p>
						</section>
						`
}


const showAwarded = (remarks = '') => {
	let targ = document.getElementById('prop-info-menu-status')

	targ.innerHTML = `<center style="background:#464a4e;color:#fff;padding:5px;">
							<p class="col-12" style="color:#ffb80c;">
								<i class="material-icons">star</i> AWARDED
					        </p>
						    </center>`
}


const changeSendToReturn = () => {
	const oldEl = document.querySelector('.send-prop-modal-btn')

	if (oldEl) {
		const newEl = oldEl.cloneNode(false)

		newEl.classList.remove('send-prop-modal-btn')
		newEl.classList.add('resend-prop-modal-btn')
		//newEl.addEventListener('click', loadReSendBidding)

		newEl.innerHTML = '<i class="material-icons md-18">keyboard_return</i> Request for new quotation '
		oldEl.replaceWith(newEl)
		// request new
		PropUtil.bindRequestNewProposal()
	}
}

// remove all remove btn in attahments
const disableRemoveAttLink = () => {
	document.querySelectorAll('.remove-prop-attachments-modal').forEach((el, index) => {
		el.parentNode.remove()
	})
}

const dial= new ProposalDialog({id: 'bidding'})
document.querySelectorAll('.proposal-dialog-btn').forEach((val, index) => {
	val.addEventListener('click', (e) => {
		e.preventDefault()
		window.bms.default.state.proposals.cur.id = e.target.getAttribute('data-resources')

		dial.dialog().then(() => {
			window.bms.default.spinner.show()


			
			// get data from server
			PropServ.view({id: e.target.getAttribute('data-resources'), token : window.localStorage.getItem('token')}).then((data) => {
				const parsedData = JSON.parse(data)



				if (parsedData[0]) {
					const json = parsedData[0]
					const targ = document.querySelector('.prop-specs-section-info')

					setTimeout(() => {

						let name = document.querySelector('#prop-info-name')
						let quantity = document.querySelector('.prop-info-quantity')
						let unit = document.querySelector('.prop-info-unit')
						let username = document.querySelector('.prop-info-username')
						//let date_created = document.querySelector('.prop-info-date-created')
						let currency = document.querySelector('#prop-info-currency')
						let amount = document.querySelector('#prop-info-amount')
						let discount = document.querySelector('#prop-info-discount')
						let remarks= document.querySelector('#prop-info-remarks')
						let usernameInitial = document.querySelector('#prop-info-name-header-section')

						let updateLink = document.querySelectorAll('.proposal-reg-dialog-btn-update')
						let attachmentSec = document.getElementById('attachment-prop-pool-section')

						

						name.textContent = json.name
						quantity.textContent = json.quantity
						unit.textContent = json.unit
						username.textContent = json.username

						//date_created.textContent = json.date_created
						usernameInitial.textContent = json.username.substr(0,2).toUpperCase()

						
						currency.textContent = json.currency
						amount.textContent = json.amount
						discount.textContent = json.discount
						remarks.textContent = json.remarks

						updateLink.forEach((val, index) => {
							val.setAttribute('data-resources', json.id)
						})

						// clear specs section first
						targ.innerHTML = ''
						attachmentSec.innerHTML = ''


						json.specs.forEach((val, index) => {
							let html = document.createElement('section')
							html.classList.add('col-12', 'row')

							// show old value
							if (((val.name != val.orig_name) || (val.value != val.orig_value)) && (val.orig_value)) {

								html.innerHTML = `<div class="col-3">
						    		<b>${val.name}</b><br/>
						    		<small class="text-danger">
						    			${val.orig_name}
						    		</small>
						    	</div>
						    	<div class="col-9">
						    		<p>
						    			${val.value}<br/>
							    		<small class="text-danger">
							    			${val.orig_value}
							    		</small>
						    		</p>
						    	</div>`

							} else {
								html.innerHTML = `<div class="col-3">
						    		<b>${val.name}</b>
						    	</div>
						    	<div class="col-9">
						    		<p>${val.value}</p>
						    	</div>`
							}

							targ.append(html)
						})

						json.attachments.forEach((val, index) => {
							AttUtil.appendAttachments(val);
						})

						let propMenu = document.getElementById('prop-info-menu')
						let statusSec= document.getElementById('prop-info-menu-status')

						// clear status
						statusSec.innerHTML = ''
						// status

						if (json.status ==0) {
							propMenu.classList.remove('hide')
						}
						if (json.status == 1 && (!window.bms.default.isCBAAsst())) {
							propMenu.classList.add('hide')
							disableRemoveAttLink()
							showSent()
						}

						if (json.status == 2) {
							showNeedChanges(json.bidders_remarks)
						}

						if (json.status == 3) {
							propMenu.classList.add('hide')
							disableRemoveAttLink()
							showAwarded()

							
						}

						if (window.bms.default.isCBAAsst() && json.status == 1) {
							showReceived(json.id)
							changeSendToReturn()
							propMenu.classList.remove('hide')
							disableRemoveAttLink()
						}



						setTimeout(() => {
							const popupInstance = new window.bms.exports.PopupES()
							// dropdown
							window.bms.default.dropdown('device-dropdown')	
							// remove
							PropUtil.bindRemove()
							// send
							PropUtil.bindSend()
							// attachments
							AttUtil.bindRemoveAttachments()
							// PR/PO
							PropUtil.bindSetReferenceNo()

						},400)

						// more settings
				

					},50)


					// enable update
					window.bms.default.lazyLoad(['./assets/js_native/assets/js/modules/Invitation/Util/ProposalRegUpdateModal.js'])
					window.bms.default.lazyLoad(['./assets/js_native/assets/js/modules/Invitation/Util/AttachmentsModal.js'])

				}



				window.bms.default.spinner.hide()
			}).catch(err => {
				window.bms.default.spinner.hide()
			})	
		})
	})
})


