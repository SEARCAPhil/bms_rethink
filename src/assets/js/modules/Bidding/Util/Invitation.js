import SuppService from '../../Suppliers/Components/List/List'

// defaults
let page = 1
let timeout = {}
let searchSupplierPage = 1

window.bms.bidding.suppliersSendingList = {}

export class Invitations{
	constructor () {
		this.SuppUtil = new SuppService()
		this.target = document.querySelector('#recently-attached-section-bidding')
		this.XHR = new window.bms.exports.XHR()

	}
	get(page) {
		return new Promise((resolve, reject) => {
			this.SuppUtil.getList({ page }).then((json) => {
				resolve(json)
			})
		})
	}

	searchSuppliers(page, param) {
		return new Promise((resolve, reject) => {
			this.SuppUtil.search({ page, param }).then((json) => {
				resolve(json)
			})
		})
	}
}


const removeFromSendingList = (e) => {
	const resources = e.target.getAttribute('data-resources')
	e.target.parentNode.parentNode.remove()
	// unchecked item
	document.querySelector(`.suppliers-send-check-list-${resources}`).checked = false
	delete window.bms.bidding.suppliersSendingList[resources]
}

const checkSupplier = (e) => {
	const targ = document.querySelector('.suppliers-invitation-sending-list-section')
	const name = e.target.suppliersName

	// add
	if (e.target.checked) {
		const html = document.createElement('div')
		html.classList.add('col-12', 'col-md-12', `list-${e.target.value}`)
		html.style.fontSize = '12px'
		html.style.marginTop = '3px'
		html.innerHTML = `
				<div class="col alert alert-dark row suppliersName" style="position:relative;overflow:hidden;text-overflow:ellipsis;">
					${name}
				</div>

		`

		const removeBtn = document.createElement('span')
		removeBtn.setAttribute('style', 'position:absolute;right:10px;top:0px;color:rgb(90,90,90);cursor:pointer;')
		removeBtn.setAttribute('data-resources', e.target.value)
		removeBtn.textContent = 'X'
		removeBtn.addEventListener('click', removeFromSendingList)

		html.querySelector('.suppliersName').append(removeBtn)

		targ.append(html)
		// ad to virtual list
		window.bms.bidding.suppliersSendingList[e.target.value] = name
	} else {
		// remove
		delete window.bms.bidding.suppliersSendingList[e.target.value]
		document.querySelector(`.list-${e.target.value}`).remove()
		
	}

	setTimeout(() => {
		// enable send button
		if (Object.keys(window.bms.bidding.suppliersSendingList).length > 0) {
			document.getElementById('modal-dialog-send-button').removeAttribute('disabled')
		}

	}, 10)


}

const Inv = new Invitations()

const show = (e) => {
	const mb = document.querySelectorAll('.more-supplier-checklist-btn')
	mb.forEach((el, index) => {
		el.remove()
	})

	Inv.get(page).then(json => {
		const data = JSON.parse(json)
		const targ = document.querySelector('.suppliers-invitation-check-list-section')

		if (data.data) {

			data.data.forEach((val, index) => {	
				let html = document.createElement('div')
				html.classList.add('col-12','row')

				// checkbutton
				const checkBtn = document.createElement('input')
				checkBtn.classList.add(`suppliers-send-check-list-${val.id}`)
				checkBtn.type = 'checkbox'
				checkBtn.value = val.id
				checkBtn.name = 'suppliers-send-check-list'
				checkBtn.addEventListener('click', checkSupplier)
				checkBtn.suppliersName = val.name


				html.innerHTML = `	
					<div class="col-1 checkBtn-section">
						
					</div>
					<div class="col-11 text-muted">
						${val.name}

					</div>`

				html.querySelector('.checkBtn-section').append(checkBtn)

				targ.append(html)
				if((index + 1) == data.data.length ) {
					page ++
					let moreBtn = document.createElement('div')
					moreBtn.classList.add('text-center', 'col-12', 'more-supplier-checklist-btn')
					moreBtn.style.background = '#F4F9FD'
					moreBtn.style.marginTop = '10px'
					moreBtn.innerHTML = '<a href="#" onclick="event.preventDefault();">More</a>'
					moreBtn.addEventListener('click',show)
					targ.append(moreBtn)
				}
			})

		}

	})

}

const searchSupplier = (e) => {
	const targ = document.querySelector('.suppliers-invitation-check-list-search-section')
	const val = e.target.getAttribute('value')
	e.target.value = e.target.value || val

	// add another page if show more is click in search result
	if (val) {
		searchSupplierPage ++
		const mb = document.querySelectorAll('.more-supplier-search-checklist-btn')
		mb.forEach((el, index) => {
			el.remove()
		})

	} else {
		// reset to default for keyup event
		searchSupplierPage = 1
	}

	if (e.target.value) {
		if (e.target.value.length > 0) {
			window.bms.default.changeDisplay(['.suppliers-invitation-check-list-search-section'],'block')
			window.bms.default.changeDisplay(['.suppliers-invitation-check-list-section'],'none')
		} else {
			window.bms.default.changeDisplay(['.suppliers-invitation-check-list-search-section'],'none')
			window.bms.default.changeDisplay(['.suppliers-invitation-check-list-section'],'block')
		}

	}


	clearTimeout(timeout)
	timeout = setTimeout(() => {
		
		if (e.target.value.length > 0) {
			Inv.searchSuppliers(searchSupplierPage, e.target.value).then(json => {
				const data = JSON.parse(json)

				if (data.data) {


					// clear section on first load
					if (searchSupplierPage == 1 && data.data.length > 0) targ.innerHTML = ''

					data.data.forEach((val, index) => {	
						let html = document.createElement('div')
						html.classList.add('col-12','row')

						// checkbutton
						const checkBtn = document.createElement('input')
						checkBtn.classList.add(`suppliers-send-check-list-${val.id}`)
						checkBtn.type = 'checkbox'
						checkBtn.value = val.id
						checkBtn.name = 'suppliers-send-check-list'
						checkBtn.addEventListener('click', checkSupplier)
						checkBtn.suppliersName = val.name


						html.innerHTML = `	
							<div class="col-1 checkBtn-section">
								
							</div>
							<div class="col-11 text-muted">
								${val.name}

							</div>`

						html.querySelector('.checkBtn-section').append(checkBtn)

						targ.append(html)
						

						if((index + 1) == data.data.length ) {
							page ++
							let moreBtn = document.createElement('div')
							moreBtn.classList.add('text-center', 'col-12', 'more-supplier-search-checklist-btn')
							moreBtn.style.background = '#F4F9FD'
							moreBtn.style.marginTop = '10px'
							moreBtn.innerHTML = `<a href="#" onclick="event.preventDefault();" value="${e.target.value}">More</a>`
							// hack for 
							moreBtn.value = e.target.value
							moreBtn.addEventListener('click',searchSupplier)
							targ.append(moreBtn)
						}
					})
				}
			})
		}

	}, 800)
}

// get supplieres list
show()

// bind search
document.getElementById('search-supplier').addEventListener('keyup', searchSupplier)
