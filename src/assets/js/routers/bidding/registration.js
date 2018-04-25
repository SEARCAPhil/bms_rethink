import IndexedDB from '../../modules/Bidding/Util/Storage/Bidding'
import IndexedDBReq from '../../modules/Bidding/Util/Storage/Requirements'
import IndexedDBPart from '../../modules/Bidding/Util/Storage/Particulars'
import ListUtilities from '../../modules/Bidding/Util/List/List.js'
import ListService from '../../modules/Bidding/Services/List/List'
import PartService from '../../modules/Bidding/Services/Particulars'
import RegUtilities from '../../modules/Bidding/Util/Registration/Registration.js'
import ReqService from '../../modules/Bidding/Services/Requirements'

const appRoute = new window.bms.exports.Router('http://127.0.0.1/bms_rethink/www/',true)
const appRoute2 = new window.bms.exports.Router('http://127.0.0.1/bms_rethink/www/',true)
const IDB = new IndexedDB()
const IDBReq = new IndexedDBReq()
const IDBPart = new IndexedDBPart()
const listUtil = new ListUtilities()
const ListServ = new ListService()
const PartServ = new PartService()
const RegUtil = new RegUtilities()
const ReqServ = new ReqService()



window.bms.default.spinner = new window.bms.exports.Spinner({
	target:'body',
	class:'spinner'
})



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
	// items from database contain id
	const resourceID = e.target.getAttribute('data-resources')
	if (resourceID) {
		// mark to be deleted
		window.bms.bidding.requirements.fundToRemove[resourceID] = true
	}

	e.target.parentNode.parentNode.parentNode.remove()
}

const addFundSelection = (param = {}) => {
	let sel = document.createElement('span')
	sel.classList.add('row', 'funds-input-section')
	sel.style.marginTop = '15px'
	// set id
	if(param.id) sel.setAttribute('data-resources',param.id)

	sel.innerHTML = `
							<div class="col-lg-3 col-md-3">
						 		<select class="form-control" name="fund-type">
						 			<option ${(param.type&&(param.type!='click')?'value="'+param.type+'"':'')}>${(param.type&&(param.type!='click')?param.type:'Select Fund')}</option>
						 			<option value="opf">Operating funds</option>
						 			<option value="otf">Other funds</option>
						 		</select>
						    </div>
						    <div class="col-lg-4 col-md-4">
						    	<input type="text" class="form-control" name="cost-center" placeholder="Cost Center / Project Name" ${(param.cost_center?'value="'+param.cost_center+'"':'')}>
						    </div>
						    <div class="col-lg-4 col-md-4">
						    	<select class="form-control" name="line-item">
						 			<option ${(param.line_item?'value="'+param.line_item+'"':'')}>${(param.line_item?param.line_item:'Select Line Item')}</option>
						 			<option value="otf">Other funds</option>
						 		</select>
						    </div>
						    <div class="col-lg-1 col-md-1">
						    	<div class="btn-circle remove-fund-btn" ${param.id ? ('data-resources="'+param.id+'"') : ''}><i class="material-icons" ${param.id ? ('data-resources="'+param.id+'"') : ''}>remove</i></div>
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
		val.removeEventListener('click', removeSpecsSection)
		val.addEventListener('click',removeSpecsSection)
	})
}

const removeSpecsSection = (e) => {
	// items from database contain id
	const resourceID = e.target.getAttribute('data-resources')
	if (resourceID) {
		// mark to be deleted
		window.bms.bidding.requirements.specsToRemove[resourceID] = true
	}

	e.target.parentNode.parentNode.parentNode.remove()
}


// specs
const addSpecsField = (param = {}) => {
	let sel = document.createElement('span')
	sel.classList.add('row', 'specs-input-section')
	sel.style.marginTop = '15px'

	// set id
	if(param.id) sel.setAttribute('data-resources',param.id)

	sel.innerHTML = `
							 <div class="col-lg-4 col-md-4">
						    	<input type="text" name="specs-name" placeholder="Name" class="form-control specs-name specs-field" ${(param.name?'value="'+param.name+'"':'')}>
						    </div>
						    <div class="col-lg-7 col-md-7">
						    	<input type="text" name="specs-value" class="form-control specs-field" placeholder="Value" ${(param.value?'value="'+param.value+'"':'')}>
						    </div>
							<div class="col-lg-1 col-md-1">
								<div class="btn-circle remove-specs-btn" ${param.id ? ('data-resources="'+param.id+'"') : ''}><i class="material-icons" ${param.id ? ('data-resources="'+param.id+'"') : ''}>remove</i></div>
								<div class="btn-circle add-specs-btn"><i class="material-icons">add</i></div>
							</div>
						`

	document.querySelector('.specs-section').append(sel)
	bindAddSpecsSection()
	bindRemoveSpecsSection()
}

appRoute2.on({
 	'/*': () => {
 		// this is required to always treat suppliers as separate route
 		// without this, link will stop working after a few clicks
 	},'/bids/forms/registration/*': (params) => {
		// show list onpageloaded
		if (!document.querySelector('.list')) {
			// listUtil.listsFromLocal({filter: 'all'})
			listUtil.lists({ token : window.localStorage.getItem('token') })
		}

	}
}).resolve()

appRoute.on({
 	'/*': () => {
 		// this is required to always treat suppliers as separate route
 		// without this, link will stop working after a few clicks
 	},
	'/bids/forms/registration/steps/1': () => {

		window.bms.default.changeDisplay(['div[name="/bids/forms/registration"]','div[name="/bids/forms/registration/1"]'],'block')
		window.bms.default.changeDisplay(['div[name="/bids/initial"]','div[name="/bids/forms/registration/2"]','div[name="/bids/forms/registration/3"]'],'none')
		
		window.bms.default.activeMenu('bids-menu-list-new')

		//toggle list sidebar for medium and small devices
		let lg = window.getComputedStyle(document.querySelector('.hidden-on-lg')).display

		if(lg=='block'){
			window.bms.default.changeDisplay(['div[name="/bids"]'],'none')	
		}

		RegUtil.loadRegistration().then(() => {
			window.bms.default.lazyLoad(['./assets/js_native/assets/js/modules/Bidding/Util/Forms/Registration/Registration.js'])
		})
		

	},
	'/bids/forms/registration/:id/steps/1/update': (params) => {
		window.bms.default.state.bidding.cur.bid.id = params.id

		window.bms.default.changeDisplay(['div[name="/bids/forms/registration"]','div[name="/bids/forms/registration/1"]'],'block')
		window.bms.default.changeDisplay(['div[name="/bids/initial"]','div[name="/bids/forms/registration/2"]','div[name="/bids/forms/registration/3"]'],'none')

		window.bms.default.spinner.show()
			
		//toggle list sidebar for medium and small devices
		let lg = window.getComputedStyle(document.querySelector('.hidden-on-lg')).display

		if(lg=='block'){
			window.bms.default.changeDisplay(['div[name="/bids"]'],'none')	
		}


		window.bms.default.spinner.show() 

		RegUtil.loadRegistration().then(() => {
			window.bms.default.lazyLoad(['./assets/js_native/assets/js/modules/Bidding/Util/Forms/Registration/RegistrationUpdate.js'])
			/*IDB.get(params.id).then(json => {
				let nameField = document.querySelector('form[name="bidding-request-registration"] input[name="name"]')
				let descField = document.querySelector('form[name="bidding-request-registration"] textarea[name="description"]')
				let deadlineField = document.querySelector('form[name="bidding-request-registration"] input[name="deadline"]')

				if (json.id) {
					nameField.value = json.name
					descField.value = json.description
					deadlineField.value = json.deadline
				}
			})*/

			let nameField = document.querySelector('form[name="bidding-request-registration"] input[name="name"]')
			let descField = document.querySelector('form[name="bidding-request-registration"] textarea[name="description"]')
			let deadlineField = document.querySelector('form[name="bidding-request-registration"] input[name="deadline"]')
			let excemptionField = document.querySelectorAll('form[name="bidding-request-registration"] input[name="forExcemption"]')

			// view data from server
			ListServ.view({id: params.id, token : window.localStorage.getItem('token')}).then(data => {

				const parsedData=JSON.parse(data)
				const json=parsedData.data

				if (json[0]) {
					nameField.value = json[0].name
					descField.value = json[0].description
					deadlineField.value = json[0].deadline
					json[0].excemption == 1 ? (excemptionField[1].checked = 'true') : (excemptionField[0].checked = 'true')
				}

				window.bms.default.spinner.hide() 
			}).catch(err => {
				window.bms.default.spinner.hide()

			})

			
		}).catch((err) => { 
			window.bms.default.spinner.hide() 
		})
		

	},
	'/bids/forms/registration/:id/steps/2': (params) => {
		window.bms.default.changeDisplay(['div[name="/bids/forms/registration"]','div[name="/bids/forms/registration/2"]'],'block')
		window.bms.default.changeDisplay(['div[name="/bids/initial"]','div[name="/bids/forms/registration/1"]','div[name="/bids/forms/registration/3"]'],'none')
		window.bms.default.spinner.show()
		//toggle list sidebar for medium and small devices
		let lg = window.getComputedStyle(document.querySelector('.hidden-on-lg')).display

		if(lg=='block'){
			window.bms.default.changeDisplay(['div[name="/bids"]'],'none')	
		}

		//mark as selected
		window.bms.bidding.selected.id = params.id
		window.bms.default.state.bidding.cur.id = params.id
		RegUtil.loadRegistrationParticulars().then(() => {
			window.bms.default.lazyLoad(['./assets/js_native/assets/js/modules/Bidding/Util/Forms/Registration/Particulars.js'])
			window.bms.default.spinner.hide()
		}).catch(err => {
			window.bms.default.spinner.hide()
		})


		

	},
	'/bids/forms/registration/:id/steps/2/update': (params) => {
		window.bms.default.spinner.show() 
		window.bms.default.changeDisplay(['div[name="/bids/forms/registration"]','div[name="/bids/forms/registration/2"]'],'block')
		window.bms.default.changeDisplay(['div[name="/bids/initial"]','div[name="/bids/forms/registration/1"]','div[name="/bids/forms/registration/3"]'],'none')
			
		//toggle list sidebar for medium and small devices
		let lg = window.getComputedStyle(document.querySelector('.hidden-on-lg')).display

		if(lg=='block'){
			window.bms.default.changeDisplay(['div[name="/bids"]'],'none')	
		}

		//mark as selected
		window.bms.bidding.selected.id = params.id
		window.bms.default.state.bidding.cur.id = params.id

		RegUtil.loadRegistrationParticulars().then(() => {
			// update
			
			window.bms.default.state.bidding.cur.particulars.id = params.id

			// view info from server
			PartServ.view({id: params.id, token : window.localStorage.getItem('token')}).then(data => {
				const json=JSON.parse(data)
				
				if (json[0]) {
					let nameField = document.getElementById('name')
					let deadlineField = document.getElementById('deadline')
					nameField.value = json[0].name
					deadlineField.value = json[0].deadline
					window.bms.default.state.bidding.cur.bid.id = json[0].bidding_id
				} 

				window.bms.default.spinner.hide()
			}).catch(err => {
				window.bms.default.spinner.hide()
			})

		})

		window.bms.default.lazyLoad(['./assets/js_native/assets/js/modules/Bidding/Util/Forms/Registration/ParticularsUpdate.js'])
		


	},
	'/bids/forms/registration/:id/steps/3': (params) => {
		window.bms.default.state.bidding.cur.particulars.id = params.id
		window.bms.default.changeDisplay(['div[name="/bids/forms/registration"]','div[name="/bids/forms/registration/3"]'],'block')
		window.bms.default.changeDisplay(['div[name="/bids/initial"]','div[name="/bids/forms/registration/1"]','div[name="/bids/forms/registration/4"]','div[name="/bids/forms/registration/2"]'],'none')
			
		//toggle list sidebar for medium and small devices
		let lg = window.getComputedStyle(document.querySelector('.hidden-on-lg')).display

		if(lg=='block'){
			window.bms.default.changeDisplay(['div[name="/bids"]'],'none')	
		}

		RegUtil.loadRegistrationItem().then(() => {
			window.bms.default.lazyLoad(['./assets/js_native/assets/js/modules/Bidding/Util/Forms/Registration/Requirements.js'])
		})
		


	},
	'/bids/forms/registration/:id/steps/3/update': (params) => {
		window.bms.default.state.bidding.cur.requirements.id = params.id
		window.bms.bidding.requirements = window.bms.bidding.requirements || {}
		window.bms.bidding.requirements.fundToRemove =  window.bms.bidding.requirements.fundToRemove || {}
		window.bms.bidding.requirements.specsToRemove =  window.bms.bidding.requirements.specsToRemove || {}

		window.bms.default.changeDisplay(['div[name="/bids/forms/registration"]','div[name="/bids/forms/registration/3"]'],'block')
		window.bms.default.changeDisplay(['div[name="/bids/initial"]','div[name="/bids/forms/registration/1"]','div[name="/bids/forms/registration/4"]','div[name="/bids/forms/registration/2"]'],'none')
		window.bms.default.spinner.show()
			
		//toggle list sidebar for medium and small devices
		let lg = window.getComputedStyle(document.querySelector('.hidden-on-lg')).display

		if(lg=='block'){
			window.bms.default.changeDisplay(['div[name="/bids"]'],'none')	
		}

		RegUtil.loadRegistrationItem().then(() => {
			ReqServ.view({ id: params.id, token: window.localStorage.getItem('token')}).then(data => {
				const parsedJson=JSON.parse(data)

				// result
				if (parsedJson[0]) {
					const json = parsedJson[0]

					window.bms.default.state.bidding.cur.bid.id = json.bidding_id

					let particularID = json.particular_id

					let nameField = document.querySelector('form[name="bidding-request-requirements"] input[name="name"]')
					let quantityField = document.querySelector('form[name="bidding-request-requirements"] input[name="quantity"]')
					let unitField = document.querySelector('form[name="bidding-request-requirements"] input[name="unit"]')
					let currencyField = document.querySelector('form[name="bidding-request-requirements"] select[name="currency"]')
					let amountField = document.querySelector('form[name="bidding-request-requirements"] input[name="amount"]')
					let fundFields = document.querySelectorAll('form[name="bidding-request-requirements"] .funds-input-section')
					//let excemptionField = document.querySelectorAll('form[name="bidding-request-requirements"] input[name="excemption"]')
					let sourceOfFundSec = document.querySelector('.source_of_fund_section')

					// reflect value
					nameField.value = json.name
					quantityField.value = json.quantity
					unitField.value = json.unit
					amountField.value = json.budget_amount

					// source of fund
					for (let  x = 0; x < json.funds.length; x++) { 
						if (x == 0) document.querySelector('.source_of_fund_section').innerHTML = ''
						addFundSelection({type:json.funds[x].fund_type, cost_center:json.funds[x].cost_center, line_item:json.funds[x].line_item, id:json.funds[x].id})
					}

					// for excemption ?
					/*if (json.bidding_excemption_request == 1) {
						excemptionField[0].setAttribute('checked', 'checked')
					}else{
						excemptionField[1].setAttribute('checked', 'checked')
					}*/

					//currency
					currencyField.innerHTML = `<option value="${json.budget_currency}">${json.budget_currency}</option>` + currencyField.innerHTML

					// specs
					for (let  x = 0; x < json.specs.length; x++) { 
						if (x == 0) document.querySelector('.specs-section').innerHTML = ''
						addSpecsField({name:json.specs[x].name, value:json.specs[x].value, id:json.specs[x].id})
					}

				}

				// specs
				bindAddSpecsSection()
				bindRemoveSpecsSection()
				window.bms.default.spinner.hide()
			}).catch(err => {
				window.bms.default.spinner.hide()
			})


			window.bms.default.lazyLoad(['./assets/js_native/assets/js/modules/Bidding/Util/Forms/Registration/RequirementsUpdate.js'])
		})

		/*RegUtil.loadRegistrationItem().then(() => {
			IDBReq.get(params.id).then((json) => {
				if (json.id) {

					let particularID = json.particular_id

					let nameField = document.querySelector('form[name="bidding-request-requirements"] input[name="name"]')
					let quantityField = document.querySelector('form[name="bidding-request-requirements"] input[name="quantity"]')
					let unitField = document.querySelector('form[name="bidding-request-requirements"] input[name="unit"]')
					let currencyField = document.querySelector('form[name="bidding-request-requirements"] select[name="currency"]')
					let amountField = document.querySelector('form[name="bidding-request-requirements"] input[name="amount"]')
					let fundFields = document.querySelectorAll('form[name="bidding-request-requirements"] .funds-input-section')
					let excemptionField = document.querySelectorAll('form[name="bidding-request-requirements"] input[name="excemption"]')
					let sourceOfFundSec = document.querySelector('.source_of_fund_section')

					// reflect value
					nameField.value = json.name
					quantityField.value = json.quantity
					unitField.value = json.unit
					amountField.value = json.budget_amount

					// source of fund
					for (let  x = 0; x < json.funds.length; x++) { 
						if (x == 0) document.querySelector('.source_of_fund_section').innerHTML = ''
						addFundSelection({type:json.funds[x].fund_type, cost_center:json.funds[x].cost_center, line_item:json.funds[x].line_item, id:json.funds[x].id})
					}

					// for excemption ?
					if (json.bidding_excemption_request == 1) {
						excemptionField[0].setAttribute('checked', 'checked')
					}else{
						excemptionField[1].setAttribute('checked', 'checked')
					}

					//currency
					currencyField.innerHTML = `<option value="${json.budget_currency}">${json.budget_currency}</option>` + currencyField.innerHTML

					// specs
					for (let  x = 0; x < json.specs.length; x++) { 
						if (x == 0) document.querySelector('.specs-section').innerHTML = ''
						addSpecsField({name:json.specs[x].name, value:json.specs[x].value, id:json.specs[x].id})
					}

					// get bidding_id from particulars
					IDBPart.get(particularID).then((jsonP) => {
						 window.bms.default.state.bidding.cur.bid.id = jsonP.bidding_id
					})
				}

				// specs
				bindAddSpecsSection()
			})
		})*/

	},
	'/bids/forms/registration/:parent/steps/4/:id': (params) => {
		window.bms.default.state.bidding.cur.requirements.id = params.id
		window.bms.default.changeDisplay(['div[name="/bids/forms/registration"]','div[name="/bids/forms/registration/3"]'],'block')
		window.bms.default.changeDisplay(['div[name="/bids/initial"]','div[name="/bids/forms/registration/1"]','div[name="/bids/forms/registration/4"]','div[name="/bids/forms/registration/2"]'],'none')
			
		//toggle list sidebar for medium and small devices
		let lg = window.getComputedStyle(document.querySelector('.hidden-on-lg')).display

		if(lg=='block'){
			window.bms.default.changeDisplay(['div[name="/bids"]'],'none')	
		}

		RegUtil.loadRegistrationItemSuccess().then(() => {
			let menu = document.querySelector('.success-menu')
			menu.innerHTML = `
				<br/>	
				<a href="#/bids/forms/registration/${params.parent}/steps/3" class="btn btn-dark btn-md add-supplier-button">Add more</a>&nbsp;
				<a href="#/bids/requirements/${params.id}" class="btn btn-success btn-md add-supplier-button">Done</a>
			`
		})
	}
}).resolve()