import { AttachmentsReq } from '../modules/Bidding/Util/Attachments/Requirements'
import IndexUtilities from '../modules/Invitation/Util/Index'
import InfoUtilities from '../modules/Bidding/Util/Info'
import PopupES from '../Components/PopupES/PopupES'
import RequirementsUtilities from '../modules/Bidding/Util/Requirements'


const appRoute = new window.bms.exports.Router('http://127.0.0.1/bms_rethink/www/',true)


const InfoUtil = new InfoUtilities()
const AttUtil = new AttachmentsReq()
const ReqUtil = new RequirementsUtilities()



const IndexUtil = new IndexUtilities()



window.bms.default.pages = []
window.bms.default.spinner = new window.bms.exports.Spinner({
	target:'body',
	class:'spinner'
})

let PopupInstance = {}


const loadCSS = (href) => {
	let css = document.createElement('link')
	css.type= 'text/css'
	css.rel = 'stylesheet'
	css.href = href
	document.body.append(css)
}


const showDeadline = () => {
	let targ = document.getElementById('detail-req-menu-status')
	targ.parentNode.style.background = '#dc3545'
	targ.parentNode.style.color = '#fff'
	targ.parentNode.innerHTML = `<section class="col-lg-11 offset-lg-1">
						<ul class="nav">
							<li class="nav-item">
								
							</li>
							<li class="nav-item">
								<a class="nav-link row">
									<i class="material-icons md-18">lock</i> Sorry ! Bidding for this item is already closed.
								</a>
							</li>


							<li class="nav-item">
								<a class="nav-link proposal-requirement-dialog-btn">
									
								</a>
							</li>

						</ul>
					</section>`
}



const appendReqAttachments = (data) => {
	const attSec = document.getElementById('attachments-requirements-info-section')
	attSec.innerHTML += `	<div class="col-lg-3 col-md-3" style="padding:5px;background:#505050;color:#fff;border:1px solid #fefefe;">
								<div class="d-flex align-items-stretch">
									<div class="col-10">
										<div class="file-icon file-icon-sm" data-type="${data.type}"></div> ${data.original_filename}
									</div>

									<div class="col-2">
										<i class="material-icons md-18 device-dropdown" data-device-dropdown="dropdown-req-${data.id}" data-resources="${data.id}">arrow_drop_down</i>
										<div class="dropdown-section float-right" id="dropdown-req-${data.id}">
											<ul class="list-group list-group-flush">
	  											<li class="list-group-item "><a href="#" onclick="event.preventDefault();window.open('http://192.168.80.56/bms_api/src/api/bidding/requirements/attachments/download.php?id=${data.id}')">Download</a></li>
											<ul>
										</div>
									</div>
								</div>
							</div>`
}


const loadRequirementsDetails = (json) => { 
	let targ = document.querySelector('.specs-section-info')
	let addBtn = document.querySelector('.proposal-reg-dialog-btn')
	let attTarg = document.getElementById('attacments-requirements-info-section')

	const date = new Date()
	const curMonth = (date.getMonth()+1) < 10 ? `0${date.getMonth()+1}` : (date.getMonth()+1)
	const currentDate = `${date.getFullYear()}-${curMonth}-${date.getDate()}`

	document.querySelector('.req-name').textContent = json.name
	document.querySelector('.req-quantity').textContent = json.quantity
	document.querySelector('.req-unit').textContent = json.unit
	document.querySelector('.req-reference-number').textContent = json.id
	document.querySelector('.req-deadline').innerHTML = `<span class="text-danger">${json.deadline != '0000-00-00' ? json.deadline : 'Not Set'}</span>`

	// show deadline status
	if(currentDate > json.deadline) {
		showDeadline()
		// hide btn
		if (addBtn) addBtn.classList.add('hide')
	} else {
		// remove add btn
		if (addBtn) addBtn.classList.remove('hide')
	}


	json.specs.forEach((val, index) => {
		targ.innerHTML += `
			<div class="col-2">
	    		<b>${val.name}</b>
	    	</div>
	    	<div class="col-10">
	    		<p>${val.value}</p>
	    	</div>
		`
	})

	json.attachments.forEach((val, index) => {
		appendReqAttachments({type: val.type, original_filename: val.original_filename, id: val.id })
	})


	setTimeout(() => {
			// dropdown
			window.bms.default.dropdown('device-dropdown')
			// enable popup
			PopupInstance = new PopupES()
			
			ReqUtil.bindShowProposalSection(json.id)

	},10)



}

const activateInvItem = (params) => {
	let targ = document.querySelectorAll(`.list-inv-section .list`)
	targ.forEach((el, index) => { 

		if (el) {
			if (el.getAttribute('data-list') == params.id) {
				targ.classList.add('active')
			} else {
				targ.classList.remove('active')
			}
		}

		
	})
}

appRoute.on({
 	'/*': () => {
 		// this is required to always treat suppliers as separate route
 		// without this, link will stop working after a few clicks
 	},
	'/inv/*': () => {
		IndexUtil.loadListSection()
		IndexUtil.loadInitialPage()
		
		loadCSS('assets/css/modules/suppliers/list.css')
	},
	'/inv/:id/info/': (params) => {
		window.bms.default.state.bidding.cur.requirements.id = params.id
		window.bms.default.changeDisplay(['div[name="/inv/initial"]'],'none')
		window.bms.default.changeDisplay(['div[name="/inv/info"]'],'block')



		IndexUtil.loadInfo({id: params.id, status: 1}).then(() => {

			ReqUtil.get(params.id).then(json => {
				if (json.id) {
					loadRequirementsDetails(json)
				}
				window.bms.default.spinner.hide()
			}).catch((err) => {
				window.bms.default.spinner.hide()
			})
		})

		// load list only once
		if (!document.querySelector('.list')) {
			IndexUtil.loadListSection()
			
			setTimeout(() => {
				activateInvItem(params)
			},2000)
			
			
		} else {
			activateInvItem(params)
		}
		
		loadCSS('assets/css/modules/suppliers/list.css')
		loadCSS('assets/css/fileicon.css')
	},
	'/inv/requirements/:id': (params) => {
		window.bms.default.spinner.show()
/*
		window.bms.default.state.bidding.cur.requirements.id = params.id
		window.bms.default.changeDisplay(['[name="/bids/info/particulars/details"]'],'block')
		window.bms.default.changeDisplay(['div[name="/bids/initial"]','div[name="/bids/forms/registration/2"]','div[name="/bids/forms/registration"]', 'div[name="/bids/forms/registration/3"]', 'div[name="/bids/info"]', '[name="/bids/info/particulars/proposals/form"]'],'none')
		IndexUtil.loadBiddingRequirementsInfo()
		IndexUtil.loadBiddingListSection()

		window.bms.default.lazyLoad(['./assets/js_native/assets/js/modules/bidding/Util/Attachments/RequirementsModal.js'])

		ReqUtil.get(params.id).then(json => {
			if (json.id) {
				loadRequirementsDetails(json)
			}
			window.bms.default.spinner.hide()
		}).catch((err) => {
			window.bms.default.spinner.hide()
		})

		loadCSS('assets/css/modules/suppliers/list.css')
		loadCSS('assets/css/fileicon.css')*/
	}
}).resolve()