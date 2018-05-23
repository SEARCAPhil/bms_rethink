import { AttachmentsReq } from '../modules/Bidding/Util/Attachments/Requirements'
import InfoUtilities from '../modules/Invitation/Util/Info'
import ListUtilities from '../modules/Invitation/Util/List'
import ListUtilitiesInv from '../modules/Invitation/Util/List'
import RequirementsUtilities from '../modules/Bidding/Util/Requirements'
import ProposalService from '../modules/Invitation/Services/Proposal'

const appRoute = new window.bms.exports.Router('http://127.0.0.1/bms_rethink/www/',true)
const appRoute2 = new window.bms.exports.Router('http://127.0.0.1/bms_rethink/www/',true)

const InfoUtil = new InfoUtilities()
const AttUtil = new AttachmentsReq()
const ReqUtil = new RequirementsUtilities()
const PropServ = new ProposalService ()
const ListUtil = new ListUtilities()
const ListUtilInv = new ListUtilitiesInv()

window.bms.default.pages = []
window.bms.default.spinner = new window.bms.exports.Spinner({
	target:'body',
	class:'spinner'
})

let PopupInstance = {}


const showDeadline = () => {
	let targ = document.getElementById('detail-req-menu-status')
	targ.parentNode.style.background = '#00897B'
	targ.parentNode.style.color = '#fff'
	targ.parentNode.style.padding = '4px'
	targ.parentNode.innerHTML = `<section class="col-lg-11 offset-lg-1">
						<ul class="nav">
							<li class="nav-item">
								
							</li>
							<li class="nav-item">
								<a class="nav-link row">

								<div class="media">
									<img class="mr-3" src="assets/img/negotiation.png" alt="negotiation" width="40px">
								<div class="media-body">
									Sorry ! Bidding for this item is already closed <i class="material-icons md-18">lock</i><br/>
									<small> You are not able to add or modify any content under this item</small>
								</div>
							  </div>

									
								</a>
							</li>


							<li class="nav-item">
								<a class="nav-link proposal-requirement-dialog-btn">
									
								</a>
							</li>

						</ul>
					</section>`
}


const showWon = () => {
	let targ = document.getElementById('detail-req-menu-status')
	targ.parentNode.style.background = '#464a4e'
	targ.parentNode.style.color = '#fff'
	targ.parentNode.innerHTML = `
	<style>
		.congrats-banner {
   			display: block;
			position:relative;
			z-index:0;
		}
		.congrats-banner:after {
			content: '';
			position: absolute;
			top: 0;
			right: 0;
			bottom:0;
			left: 0;
			background:url('assets/img/confetti.png') repeat center;
			z-index:-1;
			opacity:0.7;
		}
	</style>
	<section class="col-lg-12 text-center congrats-banner" style="padding:  20px;">
    					<p><img src="assets/img/medal.png" width="50px"/> Congratulations! You have won on this bidding</p>
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
	let printBtn = document.querySelector('.price-inquiry-btn')
	let printCurrentBtn = document.querySelector('.price-inquiry-current-btn')

	const date = new Date()
	const curMonth = (date.getMonth()+1) < 10 ? `0${date.getMonth()+1}` : (date.getMonth()+1)
	const currentDate = `${date.getFullYear()}-${curMonth}-${date.getDate()}`

	document.querySelector('.req-name').textContent = json.name
	document.querySelector('.req-quantity').textContent = json.quantity
	document.querySelector('.req-unit').textContent = json.unit
	document.querySelector('.req-reference-number').textContent = json.id
	document.querySelector('.req-bidding-number').textContent = json.id
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

	// print buttons
	printBtn.href = `${window.bms.config.network}/bidding/reports/price_inquiry.php?id=${json.bidding_requirements_invitation_id}&token=${window.localStorage.getItem('token')}`
	printCurrentBtn.href = `${window.bms.config.network}/bidding/reports/price_inquiry_per_item.php?id=${json.bidding_requirements_invitation_id}&token=${window.localStorage.getItem('token')}`

	printBtn.addEventListener('click',function(){
		window.open(this.href)
	})

	printCurrentBtn.addEventListener('click',function(){
		window.open(this.href)
	})


	// Specifications
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

	// Disable attachments viewing for supplier
	/*
	json.attachments.forEach((val, index) => {
		appendReqAttachments({type: val.type, original_filename: val.original_filename, id: val.id })
	})*/
	setTimeout(() => {
			// dropdown
			window.bms.default.dropdown('device-dropdown')
			// enable popup
			PopupInstance = new window.bms.exports.PopupES()
			// show proposals
			ReqUtil.bindShowProposalSection(json.id)
	},10)
}

const activateInvItem = (params) => {
	let targ = document.querySelectorAll(`.list-inv-section > .list`)
	targ.forEach((el, index) => { 

		if (el) {
			if (el.getAttribute('data-list') == params.id) {
				el.classList.add('active')
			} else {
				el.classList.remove('active')
			}
		}

		
	})
}

const showProposals = (params) => {

		PropServ.lists({id: params.id, token : window.localStorage.getItem('token')}).then((data) => {
			const json = JSON.parse(data)
			let targ = document.querySelectorAll('.proposal-list-section > ul')

			targ.forEach((el, index) => {
				// clear proposal list section
				el.innerHTML =''
			})

			json.forEach((val, index) => {
				let html = document.createElement('li')
				let status = ''
				html.classList.add('nav-item', 'col-12')
				html.setAttribute('data-resources', val.id)
				html.style = 'border-bottom:1px solid #ccc;padding-top:5px;padding-bottom: 5px;'
				html.id = val.id

				

				if (val.status == 0) {
					status = `<br/><span class="text-danger" data-resources="${val.id}"><i class="material-icons md-12">drafts</i> DRAFT</span>`
				}

				if (val.status == 1 || val.status == 5) {
					status = `<br/><span class="text-success" data-resources="${val.id}"><i class="material-icons md-12">check</i> Sent</span>`
				}


				if (val.status == 2) {
					status = `<br/><span class="text-danger" data-resources="${val.id}"><i class="material-icons md-12">warning</i> Requesting changes</span>`
				}

				if (val.status ==3) {
					status = `<br/><span data-resources="${val.id}" style="color:#ffb80c;"><i class="material-icons">star</i> AWARDED</span>`
					// show won status
					showWon()
					// add medal icon
					//const img = document.createElement('img')
					//img.src = 'assets/img/trophy.png'
					//img.style.width = '30px'
					//document.querySelector('.req-name').append(img)
				}

				html.innerHTML = `
                                    <a href="#" class="proposal-dialog-btn row" data-resources="${val.id}">
                                        <div class="col-3"  data-resources="${val.id}">
                                            <div class="text-center" data-resources="${val.id}" style="float:left;width:35px;height:35px;border-radius:50%;margin-right:10px;overflow:hidden;background:#42403c;color:#fff;padding-top:5px" id="image-header-section"  data-resources="${val.id}">${val.username.substr(0,2).toUpperCase()}</div>
                                        </div>
                                        <div class="col-7"  data-resources="${val.id}">
                                                <small data-resources="${val.id}">
                                                    <p data-resources="${val.id}">
                                                        ${val.username}<br/>
                                                        <span class="text-muted">${val.date_created}</span>
                                                        ${status}
                                                    </p>
                                                </small>
                                        </div>
                                    </a>
                           `
                // insert to DOM
                targ.forEach((el, index) => {
                	el.append(html)
                })
			})

			window.bms.default.lazyLoad(['./assets/js_native/assets/js/modules/Invitation/Util/ProposalModal.js'])
			window.bms.default.lazyLoad(['./assets/js_native/assets/js/modules/Invitation/Util/ProposalRegModal.js'])
		})
}

appRoute.on({
    '/*': () => {
        // without this, link will stop working after a few clicks
    },'/inv/*': () => {
		window.bms.default.activeMenu('inv-menu-list')
		window.bms.default.loadCommonSettings()
		window.bms.default.changeDisplay(['.suppliers-router-section', '.nav-top-menu', '.bids-router-section', '.welcome-router-section'],'none')

		document.querySelector('.inv-router-section').classList.remove('hide')
		setTimeout(() => {
			window.bms.default.lazyLoad(['./assets/js_native/assets/js/modules/Bidding/Util/AccountSidebar.js'],{once:true})
		},1000)

		// load DOM
		if (!document.querySelector('.list')) {
            ListUtil.loadListSec()
      	}
		// load Initial page
		ListUtil.loadInitialPage()
		// load external CSS
		window.bms.default.loadCSS('assets/css/modules/suppliers/list.css')

		// hide splash screen
		window.bms.default.hideSplash()
	}
}).resolve()

appRoute2.on({
 	'/*': () => {
 		// this is required to always treat suppliers as separate route
 		// without this, link will stop working after a few clicks
	 },
	'/inv/all': () => {
		
		window.bms.default.spinner.show()
		ListUtilInv.lists({token : window.localStorage.getItem('token')})
	},
	'/inv/:id/info/': (params) => {
		window.bms.default.spinner.show()
		window.bms.default.state.bidding.cur.invitations.id = params.id
		window.bms.default.changeDisplay(['div[name="/inv/initial"]'],'none')
		window.bms.default.changeDisplay(['div[name="/inv/info"]'],'block')

		ListUtilInv.loadInfo({id: params.id, status: 1}).then(() => {

			//get ivitation info
			InfoUtil.get(params.id).then((json) => {
				if (json.id) {
					window.bms.default.state.bidding.cur.requirements.id = json.id
					json.bidding_requirements_invitation_id = params.id
					loadRequirementsDetails(json)
				}
				window.bms.default.spinner.hide()

				// show proposals for this bidding requirement
				showProposals(json)

			}).catch((err) => {
				window.bms.default.spinner.hide()
			})

		})

		// load DOM
		if (!document.querySelector('.list')) {
            ListUtil.loadListSec().then(() => {
				ListUtilInv.lists({token : window.localStorage.getItem('token')})
			})
			
			setTimeout(() => {
				activateInvItem(params)
			},2000)
			
			
		} else {
			activateInvItem(params)
		}
		
		window.bms.default.loadCSS('assets/css/modules/suppliers/list.css')
		window.bms.default.loadCSS('assets/css/fileicon.css')
	}
}).resolve()