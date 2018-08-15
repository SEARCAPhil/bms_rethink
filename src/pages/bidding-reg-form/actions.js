const Serv = import('../../services/bidding-list-service')
const ListItem = import('../../components/list-item')

const hideSpinner = () => {
  const targ = document.querySelector('registration-section > .spinner')
  if (targ) targ.hide()
}
/**
 * Submission failed
 */
const showError = () => {
	document.getElementById('bid-form-status').innerHTML = `
    <div class="col text-danger" style="border:2px solid orangered;padding:5px;">
      Unable to process request. Please try again later
    </div>  `
    hideSpinner()
}


/**
 * Submission success
 */
const showSuccess = (json) => {
  hideSpinner()
  document.getElementById('bid-form-status').innerHTML = ''
  // remove empty message
  if (document.querySelector('.empty-list-message-section')) document.querySelector('.empty-list-message-section').remove()	
  // redirect to nex step
  window.location.hash = `#/bids/forms/registration/${json.data}/step/2`
}


/**
 * Insert newly created bidding request in DOM
 * @param {HTMLElement} target 
 * @param {Object} data 
 */
const appendItems = (target, data) => {
  // items
  ListItem.then(item => {
    const lItem = new item.default(data)
    target.prepend(lItem)
  })
}


/**
 * Create new Bidding
 * @param {*} e 
 */
const register = (e) => { 
  // spinner
  import('../../components/app-spinner').then(loader => {
    return new loader.default().show({target: 'registration-section'}).then(t => t.template.show())
  })
  e.target.disabled = 'disabled'
	e.preventDefault()
  // payload
  const __exemptionField = document.querySelector('form[name="bidding-request-registration"] input[name="forExemption"]:checked')
	const payload = {
		excemption: parseInt(__exemptionField.value),
		action: 'create',
		token: localStorage.getItem('token'),
  }
 
  
  // create
  Serv.then(loader => {
    return new loader.default().create(payload).then(json => {
      if(json.data) {
        const item = {
          class: 'col-12 list', 
          id: json.data, 
          profile_name: window.localStorage.getItem('givenName'), 
          date_created: 'Just now',
        }
        // append to DOM
        appendItems(document.querySelector('.list-bidding-section'),item)
        // clear and redirect to next step if any
        return showSuccess(json)
      }
      // failed
      showError()
      e.target.disabled = false
    })
  }).catch(err => {
    showError()
    e.target.disabled = false
  })
}

/**
 * Create new Bidding
 * @param {*} e 
 */
const update = (e) => {
  // payload
  const __exemptionField = document.querySelector('form[name="bidding-request-registration"] input[name="forExemption"]:checked')
	const __payload = {
    id: e.target.id,
		excemption: parseInt(__exemptionField.value),
		action: 'update',
		token: localStorage.getItem('token'),
  }
  
  // update
  Serv.then(loader => {
    return new loader.default().create(__payload).then(json => {
      // success
      if(json.data == 1) {
        return window.location.hash = `#/bids/${__payload.id}/info`
      }
      // failed
      return showError()
    })
  }).catch(err => {
    return showError()
  })
}

export { showError, register, update }