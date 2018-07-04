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

const registerReq = (e) => {
	e.preventDefault()
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
		id: window.bms.default.state.bidding.cur.particulars.id,
		excempted: excemptionField.value,
		specs: specsArr,
		token: localStorage.getItem('token'),
		action: 'create',
	}
	
	setTimeout(() => {
		if (document.querySelectorAll('.error').length != 0) return false

		window.bms.default.spinner.show()		

		Reg.requirements(data).then(json => {

			let res = JSON.parse(json)

			if (res.data) {
				window.location.hash = `/bids/forms/registration/${data.id}/steps/4/${res.data}`
				window.bms.default.spinner.hide()
				document.getElementById('bid-form-status').innerHTML = ''
				return 0
			}
			
			// show error
			showError()

			window.bms.default.spinner.hide()		

			
		}).catch(() => {
			showError()
			window.bms.default.spinner.hide()		

		})
	},700)


}

const bindAddFundSelection = () => {
	// funding
	document.querySelectorAll('.add-fund-btn').forEach((val, index) => {
		val.removeEventListener('click', addFundSelection)
		val.addEventListener('click', addFundSelection)
	})
}

const bindRemoveFundSelection = () => {
	// funding
	document.querySelectorAll('.remove-fund-btn').forEach((val, index) => {
		val.removeEventListener('click', removeFundSelection)
		val.addEventListener('click', removeFundSelection)
	})
}

const removeFundSelection = (e) => {
	e.target.parentNode.parentNode.parentNode.remove()
}

const addFundSelection = () => {
	let sel = document.createElement('span')
	sel.classList.add('row', 'funds-input-section')
	sel.style.marginTop = '15px'
	sel.innerHTML = `
							<div class="col-lg-3 col-md-3">
						 		<select class="form-control" name="fund-type">
						 			<option>Select Fund</option>
						 			<option value="opf">Operating funds</option>
						 			<option value="otf">Other funds</option>
						 		</select>
						    </div>
						    <div class="col-lg-4 col-md-4">
						    	<input type="text" class="form-control" name="cost-center" placeholder="Cost Center / Project Name">
						    </div>
						    <div class="col-lg-4 col-md-4">
						    	<select class="form-control" name=""line-item>
						 			<option value="opf">Select Line Item</option>
						 			<option value="otf">Other funds</option>
						 		</select>
						    </div>
						    <div class="col-lg-1 col-md-1">
						    	<div class="btn-circle remove-fund-btn"><i class="material-icons">remove</i></div>
						 		<div class="btn-circle add-fund-btn"><i class="material-icons">add</i></div>
						 		
						    </div>
						`

	document.querySelector('.source_of_fund_section').append(sel)
	bindAddFundSelection()
	bindRemoveFundSelection()
}

const bindAddSpecsSection = () => {
	// funding
	document.querySelectorAll('.add-specs-btn').forEach((val, index) => {
		val.removeEventListener('click', addSpecsField)
		val.addEventListener('click', addSpecsField)
	})
}


const bindRemoveSpecsSection = () => {
	// funding
	document.querySelectorAll('.remove-specs-btn').forEach((val, index) => {
		val.removeEventListener('click', removeFundSelection)
		val.addEventListener('click',removeSpecsSection)
	})
}

const removeSpecsSection = (e) => {
	e.target.parentNode.parentNode.parentNode.remove()
}


// specs
const addSpecsField = () => {
	let sel = document.createElement('span')
	sel.classList.add('row', 'specs-input-section')
	sel.style.marginTop = '15px'
	sel.innerHTML = `
							 <div class="col-lg-4 col-md-4">
						    	<input type="text" name="specs-name" placeholder="Name" class="form-control specs-name specs-field">
						    </div>
						    <div class="col-lg-7 col-md-7">
						    	<input type="text" name="specs-value" class="form-control specs-field" placeholder="Value">
						    </div>
							 <div class="col-lg-1 col-md-1">
							 	<div class="btn-circle remove-specs-btn"><i class="material-icons">remove</i></div>
								<div class="btn-circle add-specs-btn"><i class="material-icons">add</i></div>
							</div>
						`

	document.querySelector('.specs-section').append(sel)
	bindAddSpecsSection()
	bindRemoveSpecsSection()
}

// form
document.querySelector('form[name="bidding-request-requirements"]').addEventListener('submit', registerReq)
// fund
bindAddFundSelection()
// specs
bindAddSpecsSection()

