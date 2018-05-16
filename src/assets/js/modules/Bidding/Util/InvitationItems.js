import SuppService from '../../Suppliers/Components/List/List'
import ListService from '../../Bidding/Services/List/List'
import RequirementsService from './Requirements'

const Inv = new InvitationItems()

window.bms.bidding.suppliersSendingListItems = {}


export class InvitationItems{
	constructor () {
		this.ListServ = new ListService()
		this.target = document.querySelector('.item-sending-list-section')
		this.XHR = new window.bms.exports.XHR()

	}
	get(id) {
		return new Promise((resolve, reject) => {
			this.ListServ.view({id: id, token : window.localStorage.getItem('token')}).then(data => {
				resolve(data)
			})
		})
	}
}


const checkItem = (e) => {
	const targ = document.querySelector('.item-sending-list-section')
	const name = e.target.itemName

	// add
	if (e.target.checked) {
		// ad dto virtual list
		window.bms.bidding.suppliersSendingListItems[e.target.value] = name
	} else {
		// remove
		delete window.bms.bidding.suppliersSendingListItems[e.target.value]
	}
}


const showItems = (e) => {
	Inv.get(window.bms.default.state.bidding.cur.bid.id).then(json => {
		const data = JSON.parse(json)
		const targ = document.querySelector('.item-sending-list-section')

		if (data.data) {
			const json = data.data[0]

			json.particulars.forEach((val, index) => {
				let html = document.createElement('details')
				html.classList.add('col-12','row')
				html.innerHTML = `<summary>${val.name}</summary>`

				val.requirements.forEach((req, index) => {	
					let htmls = document.createElement('div')
					htmls.classList.add('row')

					// checkbutton
					const checkBtn = document.createElement('input')
					checkBtn.classList.add(`items-send-check-list-${req.id}`)
					checkBtn.type = 'checkbox'
					checkBtn.value = req.id
					checkBtn.name = 'items-send-check-list'
					checkBtn.addEventListener('click', checkItem)
					checkBtn.itemName = req.id


					htmls.innerHTML = `	
						<div class="col-1 checkBtn-section">
							
						</div>
						<div class="col-11 text-muted">
							${req.name}

						</div>`

					htmls.querySelector('.checkBtn-section').append(checkBtn)

					html.append(htmls)
				})

				targ.append(html)
			})
		}
	})
}


// get supplieres list
showItems()

