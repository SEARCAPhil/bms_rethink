import ProposalRegDialog from '../../../components/ProposalRegDialog/Dialog'
import ProposalService from '../../../modules/Invitation/Services/Proposal'
import ProposalUtil from '../../../modules/Invitation/Util/Info'
import RequirementsUtilities from '../../../modules/Bidding/Util/Requirements'


const PropServ = new ProposalService ()
const PropUtil = new ProposalUtil ()
const ReqUtil = new RequirementsUtilities()
const dial= new ProposalRegDialog({id: 'prop'})



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

console.log(document.querySelectorAll('.proposal-reg-dialog-btn-update'))
document.querySelectorAll('.proposal-reg-dialog-btn-update:not(.data-event-binded)').forEach((val, index) => {
	val.classList.add('data-event-binded')
	val.addEventListener('click', (e) => {
		e.preventDefault()

		const id = e.target.getAttribute('data-resources')

		dial.dialog().then(() => {
			window.bms.default.spinner.show()

			window.bms.default.spinner.hide()

			// load Proposal
			PropUtil.loadProposalForm().then(() => {
				// get proposal details
				PropServ.view({id, token : window.localStorage.getItem('token')}).then((data) => {
					// change form values
					const parsedData = JSON.parse(data)



					if (parsedData[0]) {
						const json = parsedData[0]
						const section = document.querySelector('.specs-section-proposal')
						const sectionOthers = document.querySelector('#specs-other-section')

						setTimeout(() => {

							let name = document.querySelector('.req-form-name')
							let quantity = document.querySelector('.req-quantity-reg')
							let unit = document.querySelector('.req-unit-reg')
			
				
							let amount = document.querySelector('#proposal-form-amount')
							let discount = document.querySelector('#proposal-form-discount')
							let remarks= document.querySelector('#proposal-form-remarks')

							name.textContent = json.name
							amount.value = json.amount
							discount.value = json.discount
							quantity.textContent = json.quantity
							unit.textContent = json.unit
							remarks.value = json.remarks


							// clear specs section first
							section.innerHTML = ''

							// specs
							json.orig_specs.forEach((val, index) => {
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



							// clear specs section first
							sectionOthers.innerHTML = ''
							// specs to be removed later
							window.bms.default.state.proposals.cur.specsToRemove = []

							// specs
							json.other_specs.forEach((val, index) => {
								let html = document.createElement('span')
								html.classList.add('row', 'specs-input-section', 'specs-input-section-others')
								html.setAttribute('data-resources', json.id)
								html.setAttribute('style', 'margin-top: 15px;')
								html.innerHTML = `
										<div class="col-lg-4 col-md-4">
									    	<input type="text" class="other-req-name-fields specs-input-section-name form-control" placeholder="name" value="${val.name}"/>
									    </div>
									    <div class="col-lg-8 col-md-8">
									    	<input type="text" class="other-req-value-fields specs-input-section-value form-control" placeholder="value" value="${val.value}" data-resources="${val.id}"/>
									    	<small class="orig-req-menu"></small>
									    </div>
								`
								let removeParentSpecs = document.createElement('a')
								removeParentSpecs.id = val.id
								removeParentSpecs.href = '#'
								removeParentSpecs.textContent = 'remove'
								removeParentSpecs.setAttribute('onclick', 'event.preventDefault();')
								// tag specs to be removed
								removeParentSpecs.addEventListener('click', (e) => {
									e.target.parentNode.parentNode.parentNode.remove();
									window.bms.default.state.proposals.cur.specsToRemove.push({id:e.target.id, value: 'yes'})
								})

								html.querySelector('.orig-req-menu').append(removeParentSpecs)

								sectionOthers.append(html)
							})


							// bind other specs
							const otherSpecsBtn = document.querySelector('.add-other-specs-btn')
							otherSpecsBtn.addEventListener('click', addOtherSpecsField)

							// save
							document.querySelector('.save-bidding-modal-btn').setAttribute('data-resources', json.id)

							setTimeout(() => {
								// enable popup
								const pop = new window.bms.exports.PopupES()
								ReqUtil.bindUpdateProposal()
							},10)


						})
					}
				})
			}).catch(err => {
					window.bms.default.spinner.hide()
			})	
		
		})
	})
})


