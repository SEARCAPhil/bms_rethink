import ProposalDialog from '../../../components/ProposalDialog/Dialog'
import ProposalService from '../../../modules/Invitation/Services/Proposal'

const PropServ = new ProposalService ()


const dial= new ProposalDialog({id: 'bidding'})
document.querySelectorAll('.proposal-dialog-btn').forEach((val, index) => {
	val.addEventListener('click', (e) => {
		e.preventDefault()
		dial.dialog().then(() => {
			window.bms.default.spinner.show()

			
			// get data from server
			PropServ.view({id: e.target.getAttribute('data-resources'), token : window.localStorage.getItem('token')}).then((data) => {
				const parsedData = JSON.parse(data)

				if (parsedData[0]) {
					const json = parsedData[0]
					const targ = document.querySelector('.prop-specs-section-info')

					let name = document.querySelector('#prop-info-name')
					let quantity = document.querySelector('.prop-info-quantity')
					let unit = document.querySelector('.prop-info-unit')
					let username = document.querySelector('.prop-info-username')
					let date_created = document.querySelector('.prop-info-date-created')
					let usernameInitial = document.querySelector('#prop-info-name-header-section')

					name.textContent = json.name
					quantity.textContent = json.quantity
					unit.textContent = json.unit
					username.textContent = json.username
					date_created.textContent = json.date_created
					usernameInitial.textContent = json.username.substr(0,2).toUpperCase()


					json.specs.forEach((val, index) => {
						let html = document.createElement('section')
						html.classList.add('col-12', 'row')

						// show old value
						if (val.name != val.orig_name || val.value != val.orig_value ) {

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


				}

				window.bms.default.spinner.hide()
			}).catch(err => {
				window.bms.default.spinner.hide()
			})	
		})
	})
})


