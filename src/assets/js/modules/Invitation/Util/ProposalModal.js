import ProposalDialog from '../../../components/ProposalDialog/Dialog'
import ProposalService from '../../../modules/Invitation/Services/Proposal'
import ProposalUtil from '../../../modules/Invitation/Util/Info'

const PropServ = new ProposalService ()
const PropUtil = new ProposalUtil ()


const showSent = () => {
	let targ = document.getElementById('prop-info-menu-status')

	targ.innerHTML = `<center style="background:#464a4e;color:#fff;padding:5px;">
								<p class="col-12">
									<i class="material-icons">share</i> This proposal has been sent. You cannot change your proposal any longer.
						        </p>
						    </center>`
}


const showReceived = () => {
	let targ = document.getElementById('prop-info-menu-status')

	targ.innerHTML = `<center style="background:#464a4e;color:#fff;padding:5px;">
								<p class="col-12">
									<i class="material-icons">share</i> You have received this proposal. Please review all the details before doing any further actions.
									<button class="btn btn-sm btn-danger">Award</button>
						        </p>
						    </center>`
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

						name.textContent = json.name
						quantity.textContent = json.quantity
						unit.textContent = json.unit
						username.textContent = json.username
						//date_created.textContent = json.date_created
						usernameInitial.textContent = json.username.substr(0,2).toUpperCase()

						console.log(amount)
						currency.textContent = json.currency
						amount.textContent = json.amount
						discount.textContent = json.discount
						remarks.textContent = json.remarks

						// clear specs section first
						targ.innerHTML = ''
						json.specs.forEach((val, index) => {
							let html = document.createElement('section')
							html.classList.add('col-12', 'row')

							// show old value
							if (((val.name != val.orig_name) || (val.value != val.orig_value)) && (val.orig_value)) {

								html.innerHTML = `<div class="col-2">
						    		<b>${val.name}</b><br/>
						    		<small class="text-danger">
						    			${val.orig_name}
						    		</small>
						    	</div>
						    	<div class="col-10">
						    		<p>
						    			${val.value}<br/>
							    		<small class="text-danger">
							    			${val.orig_value}
							    		</small>
						    		</p>
						    	</div>`

							} else {
								html.innerHTML = `<div class="col-2">
						    		<b>${val.name}</b>
						    	</div>
						    	<div class="col-10">
						    		<p>${val.value}</p>
						    	</div>`
							}

							targ.append(html)
						})

						let propMenu = document.getElementById('prop-info-menu')
						// status
						if (json.status == 1 && (!window.bms.default.isCBAAsst())) {
							
							showSent()
						}

						if (json.status == 2) {
							showNeedChanges(json.bidders_remarks)
						}

						if (json.status == 3) {
							showAwarded()
						}

						if ((window.bms.default.isCBAAsst() || window.bms.default.isGSU()) && json.status == 1) {
							showReceived()
							changeSendToReturn()
							propMenu.classList.remove('hide')
						}



						setTimeout(() => {
							const popupInstance = new window.bms.exports.PopupES()
							// remove
							PropUtil.bindRemove()
							// send
							PropUtil.bindSend()

						},400)

					},50)


				}

				window.bms.default.spinner.hide()
			}).catch(err => {
				window.bms.default.spinner.hide()
			})	
		})
	})
})


