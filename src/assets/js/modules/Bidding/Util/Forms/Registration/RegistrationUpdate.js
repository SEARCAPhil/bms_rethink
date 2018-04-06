import Registration from '../../../Services/Forms/Registration/Registration'
import ListTemplate from '../../../Templates/List/List'

const Reg = new Registration()
const List=new ListTemplate()
let DB = new window.bms.exports.IndexedDB()

/*const viewBiddingInfoLocal = (id) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			let trans = DB.open('bidding')
			const local = trans.get(parseInt(id))
			local.onsuccess = () => { 
				// if contains data
				if (local.result) {
					resolve(local.result)	
				}else{
					reject()	
				}
				
			}

			local.onerror = (err) => {
				reject(err)
			}

		},100)
	})
}


const setBiddingInfoToLocal = (data) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			let trans = DB.open('bidding')
			trans.put(data)
			resolve(data)
		},100)	
	})

}*/

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
	//let nameField = document.querySelector('form[name="bidding-request-registration"] input[name="name"]')
	//let descField = document.querySelector('form[name="bidding-request-registration"] textarea[name="description"]')
	//let deadlineField = document.querySelector('form[name="bidding-request-registration"] input[name="deadline"]')
	let excemptionField = document.querySelector('form[name="bidding-request-registration"] input[name="forExcemption"]:checked')

	/*if (nameField.value.length < 1) {
		nameField.classList.add('error')
		return 0
	}*/

	window.bms.default.spinner.show()
	//nameField.classList.remove('error')

	// data
	let data = {
		//name: nameField.value,
		//desc: descField.value,
		//deadline: deadlineField.value,
		id: window.bms.default.state.bidding.cur.bid.id,
		excemption: parseInt(excemptionField.value),
		action: 'update',
		token: localStorage.getItem('token'),
	}

	Reg.update(data).then(json => {

		let res = JSON.parse(json)

		if (res.data == 1) {

			window.location.hash = `#/bids/${data.id}/info`

			/*viewBiddingInfoLocal(data.id).then(json => {
				json.name = data.name
				json.description = data.desc
				json.deadline = data.deadline

				setBiddingInfoToLocal(json).then(() => {
					window.location.hash = `#/bids/${data.id}/info`
					window.bms.default.spinner.hide()
					document.getElementById('bid-form-status').innerHTML = ''
				})

			})*/
			
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