const Serv = import('../../../services/bidding-part-service')
const ListItem = import('../../../components/list-item')

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
    </div>  `
    hideSpinner()
}


/**
 * Submission success
 */
const showSuccess = (id) => {
  hideSpinner()
  // redirect to nex step
  window.location.hash = `#/bids/${id}/info`
}



/**
 * Create new Bidding
 * @param {*} e 
 */
const update = (e) => {
  e.target.disabled = 'disabled'
	e.preventDefault()
  // payload
	const __nameField = document.querySelector('form[name="bidding-request-particulars"] input[name="name"]')
  const __deadlineField = document.querySelector('form[name="bidding-request-particulars"] input[name="deadline"]')
	const __payload = {
    name: __nameField.value,
		deadline: __deadlineField.value,
		id: e.target.id,
		action: 'update',
		token: window.localStorage.getItem('token'),
  }

  if (__nameField.value.length < 1) return __nameField.classList.add('error')

  // remove error
  __nameField.classList.remove('error')
  
  // spinner
  import('../../../components/app-spinner').then(loader => {
    return new loader.default().show({target: 'registration-section'}).then(t => t.template.show())
  })

  // create
  Serv.then(loader => {
    return new loader.default().create(__payload).then(json => {
      if(json.data) {
        // clear and redirect to next step if any
        return showSuccess(e.target.biddingId)
      }
      // failed
      showError()
      e.target.disabled = false
    })
  }).catch(err => { console.log(err)
    showError()
    e.target.disabled = false
  })
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

export { update, view }