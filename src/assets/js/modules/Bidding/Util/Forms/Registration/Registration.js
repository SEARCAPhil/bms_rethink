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
		excemption: parseInt(excemptionField.value),
		action: 'create',
		token: localStorage.getItem('token'),
	}

	Reg.create(data).then(json => {
		let res = JSON.parse(json)

		if (res.data) {
			window.bms.default.spinner.hide()
			document.getElementById('bid-form-status').innerHTML = ''

			// append data
			document.querySelector('.list-bidding-section').prepend(List.render({id:res.data,name:data.name, profile_name: window.localStorage.getItem('givenName') || '', date_created:'Just Now',description:data.desc,class:'col-xs-12 col-md-12 col-sm-12 list'}))
			// remove empty message
			if (document.querySelector('.empty-list-message-section')) {
				document.querySelector('.empty-list-message-section').remove()	
			}

			window.location.hash = `#/bids/forms/registration/${res.data}/steps/2`
			return 0
		}
		
		// show error
		showError()
		
	}).catch(() => {
		showError()
	})

}

document.querySelector('form[name="bidding-request-registration"]').removeEventListener('submit', register)
document.querySelector('form[name="bidding-request-registration"]').addEventListener('submit', register)

