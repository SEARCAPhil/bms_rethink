const Serv = import('../../../services/bidding-prod-service')
let fundToRemove = []
let specsToRemove = []

const hideSpinner = () => {
  const targ = document.querySelector('registration-section > .spinner')
  if (targ) targ.hide()
}
/**
 * Submission failed
 */
const showError = () => {
	document.getElementById('reg-notif-area').innerHTML = `
    <div class="col text-danger" style="border:2px solid orangered;padding:5px;">
      Unable to process request. Please try again later
		</div><br/><br/>  `
	hideSpinner()
}


/**
 * Submission success
 */
const showSuccess = (id) => {
	hideSpinner()
  // redirect to nex step
  window.location.hash = `#/bids/requirements/${id}`
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
	// items from database contain id
	const resourceID = e.target.getAttribute('data-resources')
	if (resourceID) {
		// mark to be deleted
		fundToRemove[resourceID] = true
	}

	e.target.parentNode.parentNode.parentNode.remove()
}
	
const addFundSelection = (param = {}) => {
  const targ = param.template || document
  let sel = document.createElement('span')
  sel.classList.add('row', 'funds-input-section')
  sel.style.marginTop = '15px'
  // set id
  if(param.id) sel.setAttribute('data-resources',param.id)

  sel.innerHTML = `
              <div class="col-lg-3 col-md-3">
                  <select class="form-control" name="fund-type">
                    <option ${(param.type&&(param.type!='click')?'value="'+param.type+'"':'')}>${(param.type&&(param.type!='click')?param.type:'Select Fund')}</option>
										<option value="OpF">Select source of fund</option>
										<option value="OpF">Operating Funds</option>
										<option value="OtF" id="otf">Other Funds</option>
										<option value="OP">Obligations Payable</option>
										<option value="SF">Special Funds</option>
										<option value="OpFs">Operating Funds(Scholar)</option>
										<option value="OtFs">Other Funds(Scholar)</option>
                  </select>
                </div>
                <div class="col-lg-4 col-md-4">
                  <input type="text" class="form-control" name="cost-center" placeholder="Cost Center / Project Name" ${(param.cost_center?'value="'+param.cost_center+'"':'')}>
                </div>
                <div class="col-lg-4 col-md-4">
                  <select class="form-control" name="line-item">
                    <option ${(param.line_item?'value="'+param.line_item+'"':'')}>${(param.line_item?param.line_item:'Select Line Item')}</option>
                    <option value="">Select Line Item</option>
										<option value="Capital Expenditures">Capital Expenditures</option>
										<option value="Repairs and Maintenance">Repairs and Maintenance</option>
										<option value="Seminars and Conferences">Seminars and Conferences</option>
										<option value="Supplies">Supplies</option>
										<option value="Communication">Communication</option>
										<option value="Utilities">Utilities</option>
										<option value="Fund Raising">Fund Raising</option>
										<option value="Public Relations">Public Relations</option>
										<option value="Representation">Representation</option>
										<option value="Professional Services">Professional Services</option>
										<option value="Publications">Publications</option>
										<option value="Insurance">Insurance</option>
										<option value="Grants and Awards">Grants and Awards</option>
										<option value="Other Services">Other Services</option>
										<option value="Staff Development">Staff Development</option>
										<option value="Miscellaneous">Miscellaneous</option>
										<option value="Scholarships">Scholarships</option>
										<option value="Contingency">Contingency</option>
										<option value="Travel">Travel</option>
										<option value="Salaries and Wages">Salaries and Wages</option>
										<option value="Staff Benefits">Staff Benefits</option>
                  </select>
                </div>
                <div class="col-lg-1 col-md-1">
                  <div class="btn-circle remove-fund-btn" ${param.id ? ('data-resources="'+param.id+'"') : ''}><i class="material-icons" ${param.id ? ('data-resources="'+param.id+'"') : ''}>remove</i></div>
                  <div class="btn-circle add-fund-btn"><i class="material-icons">add</i></div>
                </div>
            `

  targ.querySelector('.source_of_fund_section').append(sel)
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
		specsToRemove[resourceID] = true
	}

	e.target.parentNode.parentNode.parentNode.remove()
}


	// specs
const	addSpecsField =  (param = {}) =>  {
  const targ = param.template || document
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

		targ.querySelector('.specs-section').append(sel)
	  bindAddSpecsSection()
		bindRemoveSpecsSection()
}

 
const view = (params) => {
  return new Promise((resolve, reject) => {
    Serv.then(res => {
      return new res.default().view(params).then(json => {
        resolve(json)
      })
    })
  }) 
}


const update = (e) => {
  e.preventDefault()
  e.target.disabled = 'disabled'
  // payload
	let __nameField = document.querySelector('form[name="bidding-request-requirements"] input[name="name"]')
	let __quantityField = document.querySelector('form[name="bidding-request-requirements"] input[name="quantity"]')
	let __unitField = document.querySelector('form[name="bidding-request-requirements"] input[name="unit"]')
	let __currencyField = document.querySelector('form[name="bidding-request-requirements"] select[name="currency"]')
	let __amountField = document.querySelector('form[name="bidding-request-requirements"] input[name="amount"]')
	let __fundFields = document.querySelectorAll('form[name="bidding-request-requirements"] .funds-input-section')
	let __excemptionField = document.querySelector('form[name="bidding-request-requirements"] input[name="excemption"]:checked')

	let __funds =[]
	let errors = 0

	let __specsFields = document.querySelectorAll('.specs-input-section')
	let __specsArr = []
	__specsFields.forEach((el, index) => {
		let specs = {}
		el.querySelectorAll('input').forEach((input, i) => {
			if (input.name === 'specs-name') specs.name = input.value
			if (input.name === 'specs-value') specs.value = input.value
		})

    // id
		if(el.getAttribute('data-resources')){
			specs.id = parseInt(el.getAttribute('data-resources'))
		}
		__specsArr.push(specs)
	})



	if (__nameField.value.length < 1) {
		__nameField.classList.add('error')
		errors++
	}else{
		__nameField.classList.remove('error')
		errors --
	}

	if (__amountField.value.length < 1) {
		__amountField.classList.add('error')
		errors++
	}else{
		__amountField.classList.remove('error')
		errors --
	}

	if (__unitField.value.length < 1) {
		__unitField.classList.add('error')
		errors++
	}else{
		__unitField.classList.remove('error')
		errors --
	}

	if (__quantityField.value.length < 1) {
		__quantityField.classList.add('error')
		errors++
	}else{
		__quantityField.classList.remove('error')
		errors --
	}

	__fundFields.forEach((val, index) => {
		__funds[index] = {}

    // id
		if(val.getAttribute('data-resources')){
			__funds[index]['id'] = parseInt(val.getAttribute('data-resources'))
		}

		val.querySelectorAll('input, select').forEach((v, i) => {
			__funds[index][v.name] = v.value
		})
	})

		// data
  const __payload = {
    name: __nameField.value,
    quantity: __quantityField.value,
    unit: __unitField.value,
    amount: __amountField.value,
    currency: __currencyField.value,
    funds: __funds,
    id: e.target.id,
    excempted: __excemptionField.value,
    specs: __specsArr,
    token: localStorage.getItem('token'),
    fundsToRemove : fundToRemove,
		specsToRemove : specsToRemove,
    action: 'update',
  }


  if (__nameField.value.length < 1) return __nameField.classList.add('error')

  // remove error
  __nameField.classList.remove('error')

  setTimeout(() => { 
    if (errors >= 0) return
    // spinner
		import('../../../components/app-spinner').then(loader => {
			return new loader.default().show({target: 'registration-section'}).then(t => t.template.show())
		})
    // create
    Serv.then(loader => {
      return new loader.default().create(__payload).then(json => {
        if(json.data) {
          // clear and redirect to next step if any
          return showSuccess(__payload.id)
        }
        // failed
        showError()
        e.target.disabled = false
      })
    }).catch(err => { console.log(err)
      showError()
      e.target.disabled = false
    })
  }, 1000)
}

export { update, view ,addFundSelection, addSpecsField }