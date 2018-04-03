import Registration from '../../../Services/Forms/Registration/Registration'
const Reg = new Registration()

const showError = () => {
	let stat = document.getElementById('bid-form-status')
	let html = `
		<div class="col text-danger" style="border:2px solid orangered;padding:5px;">
			Unable to process request. Please try again later
		</div>
	`
	stat.innerHTML = html
	window.bms.default.spinner.hide()
}

const update = (e) => {
	e.preventDefault()
	let nameField = document.querySelector('form[name="bidding-request-particulars"] input[name="name"]')
	let deadlineField = document.querySelector('form[name="bidding-request-particulars"] input[name="deadline"]')

	if (nameField.value.length < 1) {
		nameField.classList.add('error')
		return 0
	}

	window.bms.default.spinner.show()
	nameField.classList.remove('error')

	// data
	let data = {
		name: nameField.value,
		deadline: deadlineField.value,
		id: window.bms.default.state.bidding.cur.particulars.id,
		action: 'update',
	}

	Reg.particulars(data).then(json => {

		let res = JSON.parse(json)

		if (res.data) {
			window.location.hash = `#/bids/${window.bms.default.state.bidding.cur.bid.id}/info`
			window.bms.default.spinner.hide()
			//document.getElementById('bid-form-status').innerHTML = ''
			return 0
		}
		
		// show error
		// showError()
		
	}).catch(() => {
		// showError()
	})

}

document.querySelector('form[name="bidding-request-particulars"]').addEventListener('submit', update)