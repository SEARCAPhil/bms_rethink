import Registration from '../../../Services/Forms/Registration/Registration'
import ListTemplate from '../../../Templates/List/List'

const Reg = new Registration()
const List=new ListTemplate()

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

const register = (e) => {
	e.preventDefault()
	let excemptionField = document.querySelector('form[name="bidding-request-registration"] input[name="forExcemption"]:checked')


	window.bms.default.spinner.show()
	// data
	let data = {
		id: window.bms.default.state.bidding.cur.bid.id,
		excemption: parseInt(excemptionField.value),
		action: 'update',
		token: localStorage.getItem('token'),
	}

	Reg.update(data).then(json => {

		let res = JSON.parse(json)

		if (res.data == 1) {
			window.location.hash = `#/bids/${data.id}/info`
			window.bms.default.spinner.hide()
		}else{
			// show error
			showError()
		}
		
	}).catch(() => {
		showError()
	})

}

const el = document.querySelector('form[name="bidding-request-registration"]')
el.removeEventListener('submit', register, false)
el.addEventListener('submit', register, false)