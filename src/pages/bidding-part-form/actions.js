const Serv = import('../../services/bidding-part-service')
const ListItem = import('../../components/list-item')

/**
 * Submission failed
 */
const showError = () => {
	document.getElementById('reg-notif-area').innerHTML = `
    <div class="col text-danger" style="border:2px solid orangered;padding:5px;">
      Unable to process request. Please try again later
    </div>  `
}


/**
 * Submission success
 */
const showSuccess = (json) => {
  // redirect to nex step
  window.location.hash = `#/bids/forms/registration/${json.data}/step/3`
}



/**
 * Create new Bidding
 * @param {*} e 
 */
const register = (e) => {
	e.preventDefault()
  // payload
	const __nameField = document.querySelector('form[name="bidding-request-particulars"] input[name="name"]')
  const __deadlineField = document.querySelector('form[name="bidding-request-particulars"] input[name="deadline"]')
	const payload = {
    name: __nameField.value,
		deadline: __deadlineField.value,
		id: e.target.biddingId,
		action: 'create',
		token: window.localStorage.getItem('token'),
  }

  if (__nameField.value.length < 1) return __nameField.classList.add('error')

  // remove error
	__nameField.classList.remove('error')

  // create
  Serv.then(loader => {
    return new loader.default().create(payload).then(json => {
      if(json.data) {
        // clear and redirect to next step if any
        return showSuccess(json)
      }
      // failed
      showError()
    })
  }).catch(err => { console.log(err)
    showError()
  })
}

export {register}