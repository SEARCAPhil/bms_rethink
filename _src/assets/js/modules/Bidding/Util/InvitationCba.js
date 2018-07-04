import AccService from '../Services/Accounts'

const Acc = new AccService()
window.bms.bidding.CBASendingList = {}


const removeFromSendingList = (e) => {
	const resources = e.target.getAttribute('data-resources')
	e.target.parentNode.parentNode.remove()

	// unchecked item
	document.querySelector(`.cba-send-check-list-${resources}`).checked = false

	delete window.bms.bidding.CBASendingList[resources]

}

const checkCBA = (e) => {
	const targ = document.querySelector('.cba-invitation-sending-list-section')
	const name = e.target.cbaName

	// add
	if (e.target.checked) {
		const html = document.createElement('div')
		html.classList.add('col-12', 'col-md-12', `list-${e.target.value}`)
		html.style.fontSize = '12px'
		html.style.marginTop = '3px'
		html.innerHTML = `
				<div class="col alert alert-dark row cbaName" style="position:relative;overflow:hidden;text-overflow:ellipsis;">
					${name}
				</div>

		`
		const removeBtn = document.createElement('span')
		removeBtn.setAttribute('style', 'position:absolute;right:10px;top:0px;color:rgb(90,90,90);cursor:pointer;')
		removeBtn.setAttribute('data-resources', e.target.value)
		removeBtn.textContent = 'X'
		removeBtn.addEventListener('click', removeFromSendingList)

		html.querySelector('.cbaName').append(removeBtn)

		targ.append(html)
		// ad to virtual list
		window.bms.bidding.CBASendingList[e.target.value] = name
	} else {
		// remove
		delete window.bms.bidding.CBASendingList[e.target.value]
		document.querySelector(`.list-${e.target.value}`).remove()
	}

	setTimeout(() => {
		// enable send button
		if (Object.keys(window.bms.bidding.CBASendingList).length > 0) {
			document.getElementById('modal-dialog-send-button').removeAttribute('disabled')
		}

	}, 10)
}


// get CBA assts.
Acc.lists({page:1, token: window.localStorage.getItem('token')}).then(json => {
	const targ = document.querySelector('.cba-invitation-check-list-section')
	const data = JSON.parse(json)

	data.forEach((val, index) => {
		const html = document.createElement('div')
		html.classList.add('row')
		html.innerHTML =  `
			<div class="col-1 checkBtn-section"></div>
			<div class="col-11 text-muted">
				${val.profile_name}

			</div>
		`

		// checkbutton
		const checkBtn = document.createElement('input')
		checkBtn.classList.add(`cba-send-check-list-${val.id}`)
		checkBtn.type = 'checkbox'
		checkBtn.value = val.id
		checkBtn.name = 'cba-send-check-list'
		checkBtn.addEventListener('click', checkCBA)
		checkBtn.cbaName = val.profile_name

		html.querySelector('.checkBtn-section').append(checkBtn)
		targ.append(html)
	})
})


