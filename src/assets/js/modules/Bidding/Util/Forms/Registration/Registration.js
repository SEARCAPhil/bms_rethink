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
	let nameField = document.querySelector('form[name="bidding-request-registration"] input[name="name"]')
	let descField = document.querySelector('form[name="bidding-request-registration"] textarea[name="description"]')
	let deadlineField = document.querySelector('form[name="bidding-request-registration"] input[name="deadline"]')

	if (nameField.value.length < 1) {
		nameField.classList.add('error')
		return 0
	}

	window.bms.default.spinner.show()
	nameField.classList.remove('error')

	// data
	let data = {
		name: nameField.value,
		desc: descField.value,
		deadline: deadlineField.value,
		action: 'create',
	}

	Reg.create(data).then(json => {

		let res = JSON.parse(json)

		if (res.data) {
			window.location.hash = `#/bids/forms/registration/${res.data}/steps/2`
			window.bms.default.spinner.hide()
			document.getElementById('bid-form-status').innerHTML = ''

			// append data
			document.querySelector('.list-bidding-section').prepend(List.render({id:res.data,name:data.name,description:data.desc,class:'col-xs-12 col-md-12 col-sm-12 list'}))
			return 0
		}
		
		// show error
		showError()
		
	}).catch(() => {
		showError()
	})

}

document.querySelector('form[name="bidding-request-registration"]').addEventListener('submit', register)