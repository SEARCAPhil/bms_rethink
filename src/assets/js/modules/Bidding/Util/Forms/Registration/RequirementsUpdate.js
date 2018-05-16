import Registration from '../../../Services/Forms/Registration/Registration'
import ListTemplate from '../../../Templates/List/List'

const Reg = new Registration()
const List=new ListTemplate()

const showError = () => {
	let stat = document.getElementById('bid-form-requirement-status')
	let html = `
		<div class="col text-danger" style="border:2px solid orangered;padding:5px;">
			Unable to process request. Please try again later
		</div>
	`
	stat.innerHTML = html
	window.bms.default.spinner.hide()
}

const updateReq = (e) => {
	e.preventDefault()
	const id = window.bms.default.state.bidding.cur.particulars.id
	let nameField = document.querySelector('form[name="bidding-request-requirements"] input[name="name"]')
	let quantityField = document.querySelector('form[name="bidding-request-requirements"] input[name="quantity"]')
	let unitField = document.querySelector('form[name="bidding-request-requirements"] input[name="unit"]')
	let currencyField = document.querySelector('form[name="bidding-request-requirements"] select[name="currency"]')
	let amountField = document.querySelector('form[name="bidding-request-requirements"] input[name="amount"]')
	let fundFields = document.querySelectorAll('form[name="bidding-request-requirements"] .funds-input-section')
	let excemptionField = document.querySelector('form[name="bidding-request-requirements"] input[name="excemption"]:checked')

	let funds =[]
	let errors = 0

	let specsFields = document.querySelectorAll('.specs-input-section')
	let specsArr = []
	specsFields.forEach((el, index) => {
		let specs = {}

		el.querySelectorAll('input').forEach((input, i) => {
			if (input.name === 'specs-name') specs.name = input.value
			if (input.name === 'specs-value') specs.value = input.value
		})

		// id
		if(el.getAttribute('data-resources')){
			specs.id = parseInt(el.getAttribute('data-resources'))
		}
		
		specsArr.push(specs)
	})


	if (nameField.value.length < 1) {
		nameField.classList.add('error')
		errors++
	}else{
		nameField.classList.remove('error')
		errors --
	}

	if (amountField.value.length < 1) {
		amountField.classList.add('error')
		errors++
	}else{
		amountField.classList.remove('error')
		errors --
	}

	if (unitField.value.length < 1) {
		unitField.classList.add('error')
		errors++
	}else{
		unitField.classList.remove('error')
		errors --
	}

	if (quantityField.value.length < 1) {
		quantityField.classList.add('error')
		errors++
	}else{
		quantityField.classList.remove('error')
		errors --
	}

	fundFields.forEach((val, index) => {
		funds[index] = {}

		// id
		if(val.getAttribute('data-resources')){
			funds[index]['id'] = parseInt(val.getAttribute('data-resources'))
		}

		val.querySelectorAll('input, select').forEach((v, i) => {
			funds[index][v.name] = v.value
		})
	})


	// data
	let data = {
		name: nameField.value,
		quantity: quantityField.value,
		unit: unitField.value,
		amount: amountField.value,
		currency: currencyField.value,
		funds: funds,
		id: parseInt(window.bms.default.state.bidding.cur.requirements.id),
		excempted: excemptionField.value,
		specs: specsArr,
		fundsToRemove : window.bms.bidding.requirements.fundToRemove,
		specsToRemove : window.bms.bidding.requirements.specsToRemove,
		action: 'update',
	}
	
	setTimeout(() => {
		if (document.querySelectorAll('form[name="bidding-request-requirements"] .error').length != 0) return false
		window.bms.default.spinner.show()	

		Reg.requirements(data).then(json => {
			let res = JSON.parse(json)

			if (res.data == 1) {			
				window.location.hash = `#/bids/${window.bms.default.state.bidding.cur.bid.id}/info`
				window.bms.default.spinner.hide()
				document.getElementById('bid-form-status').innerHTML = ''
				return 0
			}
			
			// show error
			showError()
			
		}).catch(() => {
			showError()
		})
	},700)

}


// form
document.querySelector('form[name="bidding-request-requirements"]').addEventListener('submit', updateReq)
