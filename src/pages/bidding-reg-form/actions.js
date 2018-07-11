const Serv = import('../../services/bidding-list-service')
const ListItem = import('../../components/list-item')

/**
 * Submission failed
 */
const showError = () => {
	document.getElementById('bid-form-status').innerHTML = `
    <div class="col text-danger" style="border:2px solid orangered;padding:5px;">
      Unable to process request. Please try again later
    </div>  `
}


/**
 * Submission success
 */
const showSuccess = () => {
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
	e.preventDefault()
	let exemptionField = document.querySelector('form[name="bidding-request-registration"] input[name="forExemption"]:checked')

	// payload
	let payload = {
		excemption: parseInt(exemptionField.value),
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
        showSuccess()
        return 0
      }
      // failed
      showError()
    })
  }).catch(err => {
    showError()
  })

}

export { showError, register }