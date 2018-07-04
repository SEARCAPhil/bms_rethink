import { Attachments } from '../modules/Bidding/Util/Attachments'
import ListUtilities from '../modules/Bidding/Util/List/List'
import InfoUtilities from '../modules/Bidding/Util/Info'
import RequirementsUtilities from '../modules/Bidding/Util/Requirements'
import ParticularUtilities from '../modules/Bidding/Util/Particulars'

const AttUtil = new Attachments()
const ListUtil = new ListUtilities()
const InfoUtil = new InfoUtilities()
const ReqUtil = new RequirementsUtilities()
const PartUtil = new ParticularUtilities()

const XHR = new window.bms.exports.XHR()
const appRoute = new window.bms.exports.Router('http://127.0.0.1/bms_rethink/www/',true)
const appRoute2 = new window.bms.exports.Router('http://127.0.0.1/bms_rethink/www/',true)

let PopupInstance = {}

/**
 * Load bidding information based on ID
 * 
 * @function viewBiddingInfo
 * @param {number} id - Bidding request ID
 */
const viewBiddingInfo = (id) => {
	ListUtil.view(id).then(data => {
		// parse response
		const parsedData = JSON.parse(data)
        const json = parsedData.data
        // hide loading
        window.bms.default.spinner.hide()
        // dispatch listener
		var e = new CustomEvent('biddingInfoChange', {detail: json})
		document.dispatchEvent(e)

		// save particulars to storage
		json[0].particulars.forEach((val, index) => {
			// return an int
			val.id = parseInt(val.id)
			val.bidding_id = parseInt(val.bidding_id)

			// requirements
			val.requirements.forEach((res, i) => {
				res.id = parseInt(res.id)
				res.particular_id = parseInt(res.particular_id)
			})
		})
		
	})	
}

/**
 * Send bidding to CBA Recording Assistant
 * This will change the status from 0 to 1
 * 
 * @function sendBidding
 */
const sendBidding = (e) => {
	window.bms.default.spinner.show()

	let data = {
		id: window.bms.default.state.bidding.cur.bid.id,
		status: e.target.el.status,
		token : window.localStorage.getItem('token')
	}

	ListUtil.changeStatus(data).then((json) => {
		let res = JSON.parse(json)

		if(res.data){
			// force reload
			window.location.reload()
		} else {
			alert('Oops! Unable to resend this request. Please try again later.')
		}

		window.bms.default.spinner.hide()
		document.getElementById('bidding-modal').close()


	}).catch((err) => {
		window.bms.default.spinner.hide()
		document.getElementById('bidding-modal').close()
	})
}

/**
 * Send bidding request back to the author
 * This will change the status to 2
 * 
 * @function loadReSendBidding
 */
const loadReSendBidding = (e) => {
	const URL='pages/bidding/modal/send.html'
	const id=e.target.id

	return XHR.request({method:'GET',url:URL}).then(res=>{
		let modalTarget=document.getElementById('modal-bidding-body')
		modalTarget.innerHTML=res

		setTimeout(()=>{
			window.bms.default.scriptLoader(modalTarget)
			//remove cancel
			document.getElementById('modal-dialog-close-button').addEventListener('click',()=>{
				document.getElementById('bidding-modal').close()
			})

			let btn = document.getElementById('modal-dialog-send-button')
			btn.el =  e.target
			btn.addEventListener('click', sendBidding)
		},50)
	}).catch(e=>{})
}

/**
 * Send bidding toGSU for the next process
 * This will change the status to 3
 * 
 * @function loadApproveBidding
 */
const loadApproveBidding = (e) => {
	const URL='pages/bidding/modal/approve.html'
	const id=e.target.id

	return XHR.request({method:'GET',url:URL}).then(res=>{
		let modalTarget=document.getElementById('modal-bidding-body')
		modalTarget.innerHTML=res

		setTimeout(()=>{
			window.bms.default.scriptLoader(modalTarget)
			//remove cancel
			document.getElementById('modal-dialog-close-button').addEventListener('click',()=>{
				document.getElementById('bidding-modal').close()
			})

			let btn = document.getElementById('modal-dialog-send-button')
			btn.el =  e.target
			btn.addEventListener('click', sendBidding)
		},50)
	}).catch(e=>{})
}


const loadDisapproveBidding = (e) => {
	const URL='pages/bidding/modal/disapprove.html'
	const id=e.target.id

	return XHR.request({method:'GET',url:URL}).then(res=>{
		let modalTarget=document.getElementById('modal-bidding-body')
		modalTarget.innerHTML=res

		setTimeout(()=>{
			window.bms.default.scriptLoader(modalTarget)
			//remove cancel
			document.getElementById('modal-dialog-close-button').addEventListener('click',()=>{
				document.getElementById('bidding-modal').close()
			})

			let btn = document.getElementById('modal-dialog-send-button')
			btn.el =  e.target
			btn.addEventListener('click', sendBidding)
		},50)
	}).catch(e=>{})
}


/**
 * Mark the bidding as failure
 * This will change the status to 6
 * 
 * @function loadFailedBidding
 */
const loadFailedBidding = (e) => {
	const URL='pages/bidding/modal/failed.html'
	const id=e.target.id

	return XHR.request({method:'GET',url:URL}).then(res=>{
		let modalTarget=document.getElementById('modal-bidding-body')
		modalTarget.innerHTML=res

		setTimeout(()=>{
			window.bms.default.scriptLoader(modalTarget)
			//remove cancel
			document.getElementById('modal-dialog-close-button').addEventListener('click',()=>{
				document.getElementById('bidding-modal').close()
			})

			let btn = document.getElementById('modal-dialog-send-button')
			btn.el =  e.target
			btn.addEventListener('click', sendBidding)
		},50)
	}).catch(e=>{})
}


/**
 * Mark the bidding as Closed/ Done
 * This will change the status to 5
 * 
 * @function loadCloseBidding
 */
const loadCloseBidding = (e) => {
	const URL='pages/bidding/modal/close.html'
	const id=e.target.id

	return XHR.request({method:'GET',url:URL}).then(res=>{
		let modalTarget=document.getElementById('modal-bidding-body')
		modalTarget.innerHTML=res

		setTimeout(()=>{
			window.bms.default.scriptLoader(modalTarget)
			//remove cancel
			document.getElementById('modal-dialog-close-button').addEventListener('click',()=>{
				document.getElementById('bidding-modal').close()
			})

			let btn = document.getElementById('modal-dialog-send-button')
			btn.el =  e.target
			btn.addEventListener('click', sendBidding)
		},50)
	}).catch(e=>{})
}


/* --------------------------
| MENU based on status
|----------------------------*/

/**
 * @function showBiddingReqSent
 */
const showBiddingReqSent = () => {
	const targ = document.getElementById('detail-info-menu-status')
    targ.innerHTML = `<center class="row" style="background:#0c5460;color:#fff;padding:5px;">
		<p class="col-12">
        	 Bidding Request Sent. You Are not able to modify the content of this bidding request. 
        </p>
    </center>`
}

/**
 * Shows when the request IS FOR APPROVAL
 * 
 * @function showBiddingReqApprove 
 */
const showBiddingReqApprove = () => {
	const targ = document.getElementById('detail-info-menu-status')

	targ.innerHTML = `<center class="row" style="background:#495057;color:#fff;padding:5px;">
		<p class="col-12">
        	This Bidding request is for approval. Make sure you review this request before making any further actions.  <span id="disapprove-btn-section"></span> <span id="approve-btn-section"></span> 
        </p>
    </center>`


    const btn = document.createElement('button')
    btn.classList.add('btn', 'btn-danger', 'btn-sm', 'approve-btn')
    btn.setAttribute('data-target', '#bidding-modal')
    btn.setAttribute('data-popup-toggle', 'open')

    btn.textContent = 'Approve'
    btn.status = 3
    btn.addEventListener('click', loadApproveBidding)

	targ.querySelector('#approve-btn-section').append(btn)

    // enable popup
	PopupInstance = new window.bms.exports.PopupES()
}

/**
 * Shows when the request was APPROVED
 * 
 * @function showBiddingApprove
 */
const showBiddingApprove = () => {
	const targ = document.getElementById('detail-info-menu-status')
	targ.innerHTML = `<center class="row" style="background:#00897B;color:#fff;padding:5px;">
		<p class="col-12">
        	<i class="material-icons md-18">check_circle</i> This Bidding request was approved. You may close this bidding request now <span id="failed-btn-section"></span> <span id="close-btn-section"></span>
        </p>
    </center>`

    const btn = document.createElement('button')
    btn.classList.add('btn', 'btn-danger', 'btn-sm', 'approve-btn')
    btn.setAttribute('data-target', '#bidding-modal')
    btn.setAttribute('data-popup-toggle', 'open')
	// closed status
    btn.textContent = 'Close'
    btn.status = 5
    btn.addEventListener('click', loadCloseBidding)

    const btn2 = document.createElement('button')
    btn2.classList.add('btn', 'btn-dark', 'btn-sm', 'approve-btn')
    btn2.setAttribute('data-target', '#bidding-modal')
    btn2.setAttribute('data-popup-toggle', 'open')
	// failed status
    btn2.textContent = 'Failed'
    btn2.status = 6

    btn2.addEventListener('click', loadFailedBidding)
    targ.querySelector('#close-btn-section').append(btn)
    targ.querySelector('#failed-btn-section').append(btn2)

}

/**
 * Shows when the request was APPROVED
 * This is when the current role is GSU
 * 
 * @function showBiddingApproveReadOnly
 */
const showBiddingApproveReadOnly = () => {
	const targ = document.getElementById('detail-info-menu-status')
	targ.innerHTML = `<center class="row" style="background:#00897B;color:#e6e6e6;padding:5px;">
		<p class="col-12">
		<i class="material-icons md-18">check_circle</i> This Bidding request was approved. You may now invite suppliers to bid on this request
        </p>
    </center>`

}


/**
 * @function showBiddingReqReturned
 */
const showBiddingReqReturned = () => {
	const targ = document.getElementById('detail-info-menu-status')
	targ.innerHTML = `<center class="row" style="background:#0c5460;color:#fff;padding:5px;">
		<p class="col-12">
        	This Bidding request was returned. Make sure that all details are complete and follows the bidding request standard procedures
        </p>
    </center>`
}


/**
 * @function showBiddingClosed
 */
const showBiddingClosed = () => {
	const targ = document.getElementById('detail-info-menu-status')
	targ.innerHTML = `<center class="row" style="background:#444;color:#fff;padding:5px;">
		<p class="col-12">
		<section class="col-lg-5 offset-lg-4">
			<ul class="nav">
				<li class="nav-item"></li>
				<li class="nav-item">
					<a class="nav-link row">
						<div class="media">
							<i class="material-icons md-36 mr-3">lock</i>
							<div class="media-body">
								Sorry ! Bidding for this item is already closed <br>
								<small> You are not able to add or modify any content under this item</small>
							</div>
						</div>	
					</a>
				</li>

				<li class="nav-item">
					<a class="nav-link proposal-requirement-dialog-btn"></a>
				</li>
			</ul>
		</section>
        </p>
    </center>`
}


/**
 * @function showBiddingFailed
 */
const showBiddingFailed = () => {
	const targ = document.getElementById('detail-info-menu-status')
	targ.innerHTML = `<center class="row" style="background:#dc3545;color:#fff;padding:5px;">
		<p class="col-12">
        	This bidding request has been closed due to failure of bidding. Fore more info. please contact the Administrator<i class="material-icons">lock</i>
        </p>
    </center>`
}


/**
 * @function showBiddingDisapproved
 */
const showBiddingDisapproved = () => {
	const targ = document.getElementById('detail-info-menu-status')
	targ.innerHTML = `<center class="row" style="background:#dc3545;color:#fff;padding:5px;">
		<p class="col-12">
        	This Bidding has been disapproved! This bidding request is now closed <i class="material-icons">lock</i>
        </p>
    </center>`
}

/**
 * @function showBiddingExemption
 */
const showBiddingExemption = () => {
	const targ = document.getElementById('detail-info-menu-status')
	if(!document.getElementById('detail-info-menu-bidding-exemption')) {
		const status = document.createElement('center')
		status.classList.add('row')
		status.id = 'detail-info-menu-bidding-exemption'
		status.setAttribute('style', 'background:#5d5d5d;color:#fff;padding:5px;font-weight: bold;')
		status.innerHTML = `
			<p class="col-lg-10 offset-lg-1">
	        	<i class="material-icons md-36">touch_app</i> FOR BIDDING EXEMPTION<br/>
	        	<small>This request is not intended for all suppliers. Please DO NOT send an invitation twice if possible. </small>
	        </p>
	   `
		targ.prepend(status)
	}


}


const changeSendToResend = () => {
	const oldEl = document.querySelector('.send-bidding-modal-btn')
	const newEl = oldEl.cloneNode(false)

	newEl.classList.remove('send-bidding-modal-btn')
	newEl.classList.add('resend-bidding-modal-btn')
	newEl.addEventListener('click', loadReSendBidding)

	newEl.innerHTML = '<i class="material-icons md-18">send</i> Re-Send '
	newEl.status = 1

	oldEl.replaceWith(newEl)
}


const changeSendToReturn = () => {
	const oldEl = document.querySelector('.send-bidding-modal-btn')
	const newEl = oldEl.cloneNode(false)

	newEl.classList.remove('send-bidding-modal-btn')
	newEl.classList.add('resend-bidding-modal-btn')
	newEl.addEventListener('click', loadReSendBidding)

	newEl.innerHTML = '<i class="material-icons md-18">keyboard_return</i> Return '
	newEl.status = 2

	oldEl.replaceWith(newEl)
}




const appendAttachments = (data) => {
	const attSec = document.getElementById('attacments-info-section')
	attSec.innerHTML += `	<div class="col-lg-3 col-md-3" style="padding:5px;background:#505050;border:1px solid #fefefe;position:relative;color:#fff;">
								<div class="d-flex align-items-stretch">

									<div class="col-10">
										<div class="file-icon file-icon-sm" data-type="${data.type}"></div> ${data.original_filename}
									</div>

									<div class="col-2">
										<i class="material-icons md-18 device-dropdown" data-device-dropdown="dropdown-${data.id}" data-resources="${data.id}">arrow_drop_down</i>
										<div class="dropdown-section float-right" id="dropdown-${data.id}">
											<ul class="list-group list-group-flush">
	  											<li class="list-group-item"><a href="#" onclick="event.preventDefault();window.open('${window.bms.config.network}/bidding/attachments/download.php?id=${data.id}')">Download</a></li>
												<li class="list-group-item for-open"><a data-target="#bidding-modal" data-popup-toggle="open" href="#" class="remove-attachments-modal">Remove</a></li>
											<ul>
										</div>
									</div>
								</div>
							</div>`
}

const appendParticulars = (data) => {
	let html = `
		<div class="particulars" style="font-size:14px;">
	    	<details open>
	    		<summary class="text-info">
	    			${data.name}
	    			<span class="float-right text-danger"></span>

	    		</summary>
	    		<div class="col-lg-12" style="padding-top:5px;padding-bottom:5px;background:#f6f6f6;">
	    			
	    			<p>
	    				<span class="badge badge-danger">${data.requirements.length}</span> <span class="text-danger">Requirements &emsp;
	    				<u class="for-open"><a href="#/bids/forms/registration/${data.id}/steps/3">Add New</a></u></span>
	    			</p>
	    			`
	// requirements
	for (let x = 0; x < data.requirements.length; x++) {
		html +=`
			<section>
				
    			<p style="border-left:2px solid green;padding-left:10px;"><b><a href="#/bids/requirements/${data.requirements[x].id}"><u>${data.requirements[x].name}</u></a></b> 
    				<span>(${data.requirements[x].quantity} ${data.requirements[x].unit})</span>`

    				for (let y = 0; y < data.requirements[x].funds.length; y++) {
    					html +=`
    						<span class="badge badge-dark">${data.requirements[x].funds[y].fund_type} - ${data.requirements[x].funds[y].cost_center} - ${data.requirements[x].funds[y].line_item}</span>
    					`
    				}

    	// not applicable for already awarded requirements
    	if (data.requirements[x].awardees.length < 1) {
	    	html +=`	<span class="for-open">
	    					<a href="#/bids/forms/registration/${data.requirements[x].id}/steps/3/update"><i class="material-icons md-12 text-muted">edit</i></a>
	    					<a href="#" class="remove-requirements-modal-btn" data-target="#bidding-modal" data-popup-toggle="open" id="${data.requirements[x].id}"><i class="material-icons md-12 text-muted" id="${data.requirements[x].id}">remove_circle_outline</i></a>&emsp;
	    				</span>
	    				<span class="float-right text-danger">${data.requirements[x].budget_currency} ${new Intl.NumberFormat('en-us', {maximumSignificantDigits:3}).format(data.requirements[x].budget_amount)}</span><br/>
	    				<span class="text-muted">${data.requirements[x].bidding_excemption_request ===1 ? 'For bidding excemption' : ''}</span>
	    			
			`


		} else {

			html +=`<span class="" style="color:#ffb80c;">
						<i class="material-icons md-18">star</i> 
						<span>Awarded</span>
					</span>
					<span class="float-right text-danger">${data.requirements[x].budget_currency} ${new Intl.NumberFormat('en-us', {maximumSignificantDigits:3}).format(data.requirements[x].budget_amount)}</span>

					`
		}


		html +=`</p></section>`
	}

	html +=`
	    		</div>
	    	</details>
	    	<div class="col-lg-12">
		    	<span class="deadline">
		    		<b>Deadline</b> : ${data.deadline}<br/>
		    		<!--menu -->
		    		<span class="particulars-menu for-open" style="visibility:hidden;">
	    				<a href="#" class="remove-particulars-modal" data-target="#bidding-modal" data-popup-toggle="open" id="${data.id}">Remove</a>&emsp;

	    				<a href="#/bids/forms/registration/${data.id}/steps/2/update">Edit</a>&emsp;<br/>

	    			</span>
		    	</span>
		    </div>
	    </small>
	`
	document.getElementById('particulars-section').innerHTML += html

	PopupInstance = new window.bms.exports.PopupES()

	// remove particulars
	PartUtil.bindRemoveParticulars()
	// remove requirements
	ReqUtil.bindRemoveRequirements()
}


const changeBiddingInfo = (e) => {
	const details = e.detail[0]
	const collabsSec = document.getElementById('bidding-collaborators')
	const attSec = document.getElementById('attacments-info-section')

	// print buttons
	document.querySelectorAll('.print-btn').forEach((el, index) => {
		el.href = `${window.bms.config.network}/bidding/reports/bidding_request.php?id=${details.id}`
	})

	// update buttons
	document.querySelectorAll('.update-bidding-modal-btn').forEach((el, index) => {
		el.href = `#/bids/forms/registration/${details.id}/steps/1/update`
	})

	// menu
	if (details.status == 0) {
		window.bms.default.toggleOpenClasses(['.for-open'], 'block')
	} 
	// for regular USER
	if (details.status == 1 && !window.bms.default.isCBAAsst()) {
		showBiddingReqSent()
		// clear menu, this will prevent changes
		document.getElementById('detail-info-menu').innerHTML = ''
	}

	// for CBA Asst /APPROVE
	if (details.status == 1 && window.bms.default.isCBAAsst()) {
		showBiddingReqApprove()
		changeSendToReturn()
		window.bms.default.toggleOpenClasses(['.for-open'], 'block')

	}
	// for both
	// must change to send to resend
	if (details.status == 2) {
		showBiddingReqReturned()
		changeSendToResend()
		window.bms.default.toggleOpenClasses(['.for-open'], 'block')

	}

	if (details.status == 3  && window.bms.default.isCBAAsst()) {
		showBiddingApprove()
		changeSendToResend()
		// change menu
		document.querySelector('#detail-info-menu ul.for-open').classList.remove('for-open')
		document.querySelector('.remove-bidding-modal-btn').remove()
		document.querySelector('.update-bidding-modal-btn').remove()



	}

	// for GSU
	// enale all commands
	if (details.status == 3  && window.bms.default.isGSU()) {
		showBiddingApproveReadOnly()
		// changeSendToResend()
		//window.bms.default.toggleOpenClasses(['.for-open'], 'block')
		// prevent any changes
		//document.getElementById('detail-info-menu').innerHTML = ''
		// disable other menus
		document.querySelector('#detail-info-menu >ul.for-open').classList.remove('for-open')
		document.querySelector('.send-bidding-modal-btn').remove()
		document.querySelector('.remove-bidding-modal-btn').remove()
		document.querySelector('.update-bidding-modal-btn').remove()

	}

	// close
	if (details.status == 5) {
		showBiddingClosed()
		// prevent any changes
		document.getElementById('detail-info-menu').innerHTML = ''

	}


	// disapproved
	if (details.status == 6) {
		showBiddingDisapproved()
		// prevent any changes
		document.getElementById('detail-info-menu').innerHTML = ''

	}


	// failed
	if (details.status == 6) {
		showBiddingFailed()
		// prevent any changes
		document.getElementById('detail-info-menu').innerHTML = ''

	}

	// show exemption status
	if (details.excemption ==1 ) {
		showBiddingExemption()
	}


	// info
	document.getElementById('bidding-created-by-info').innerHTML = `${details.profile_name}`
	document.getElementById('bidding-number-info').innerHTML = `#${details.id}`
	document.getElementById('bidding-excemption-info').innerHTML = `${details.excemption == 1 ? 'YES' : 'NO'}`
	document.getElementById('bidding-date-created').innerHTML = `${details.date_created}`
	document.getElementById('image-info-section').innerHTML = `${details.profile_name ? details.profile_name.substr(0,2).toUpperCase() : ''}`

	// clear section
	document.getElementById('particulars-section').innerHTML = ''
	collabsSec.innerHTML = ''
	attSec.innerHTML = ''

	// particulars
	if (details.particulars) {
		for (let x = 0; x < details.particulars.length; x++) {
			// particulars
			appendParticulars(details.particulars[x])	
		}
	}

	// email
	if (details.collaborators) {
		for (var i = 0; i < details.collaborators.length; i++) {
			collabsSec.innerHTML += `<span class="">${details.collaborators[i].profile_name};</span> `
		}	
	}

	// attachments
	for (var i = 0; i < details.attachments.length; i++) {
		appendAttachments(details.attachments[i])	
	}


	setTimeout(function() {
		// dropdown
		window.bms.default.dropdown('device-dropdown')
		// enable popup
		PopupInstance = new window.bms.exports.PopupES()
		// remove attachments
		AttUtil.bindRemoveAttachments()
	}, 1000);



	// show all menus ONLY for OPEN Bidding Request
	setTimeout(() => {
		// for CBA Asst /APPROVE
		window.bms.default.showAllMenuForOpen (details.status == 0) 
		// for CBA Asst /APPROVE
		window.bms.default.showAllMenuForOpen (details.status == 1 && window.bms.default.isCBAAsst()) 
		// for both
		// must change to send to resend
		window.bms.default.showAllMenuForOpen (details.status == 2) 
		// GSU
		//window.bms.default.showAllMenuForOpen (details.status == 3 && window.bms.default.isCBAAsst()) 
		
		//load icon
		window.bms.default.loadCSS('assets/css/fileicon.css')

	},1000)	
}



// hide menu dropdown
const hideListFilter = () => {
    const targ = document.getElementById('list-menu-drop')
    if (targ) targ.classList.remove('open')
}


appRoute.on({
    '/*': () => {
        // without this, link will stop working after a few clicks
    },
   '/bids/*': () => {
		// active menu
		window.bms.default.activeMenu('bids-menu-list')
		window.bms.default.loadCommonSettings()
		
		// hide other sections
		window.bms.default.changeDisplay(['.suppliers-router-section', '.welcome-router-section', '.nav-top-menu'],'none')
		
		document.querySelector('.bids-router-section').classList.remove('hide')
		// load DOM
		if (!document.querySelector('.list')) {
			ListUtil.loadListSec()
		}
		
		ListUtil.loadBiddingInitialPage()

		// load external css
		window.bms.default.loadCSS('assets/css/modules/suppliers/list.css')

		// hide splash screen
		window.bms.default.hideSplash()
	   
		setTimeout(() => {
			window.bms.default.lazyLoad(['./assets/js_native/assets/js/modules/Bidding/Util/AccountSidebar.js'],{once:true})
		},1000)
   }
}).resolve()


appRoute2.on({
    '/*': () => {
        // without this, link will stop working after a few clicks
    },
   '/bids/all': () => {
       window.bms.default.spinner.show()
       ListUtil.lists({token : window.localStorage.getItem('token')})
       hideListFilter()
       window.bms.default.activeMenu('bids-menu-list-all')
   },
   '/bids/drafts': () => {
       window.bms.default.spinner.show()
       ListUtil.lists({filter: 'drafts', token : window.localStorage.getItem('token')})
       hideListFilter()
       window.bms.default.activeMenu('bids-menu-list-drafts')
   },
   '/bids/:id/info/': (params) => {
       // change DOM and state
        window.bms.default.state.bidding.cur.bid.id = params.id
        window.bms.default.changeDisplay(['div[name="/bids/initial"]','div[name="/bids/forms/registration/2"]','div[name="/bids/forms/registration"]','div[name="/bids/forms/registration/3"]', '[name="/bids/info/particulars/proposals/form"]'],'none')
		window.bms.default.changeDisplay(['div[name="/bids/info/particulars/details"]'],'block')
		
        // clear settings
        window.bms.bidding.requirements = window.bms.bidding.requirements || {}
        window.bms.bidding.requirements.fundToRemove =  {}
        window.bms.bidding.requirements.specsToRemove =  {}
		window.bms.default.spinner.show()
		
		// load bidding list
        if (!document.querySelector('.list')) {
            ListUtil.lists({ token : window.localStorage.getItem('token') }) 
		}
		
        // change list to active
        document.querySelectorAll(`.list`).forEach((el, index) => {
			if (el.getAttribute('data-list')==params.id) {
				el.classList.add('active')
			} else {
				el.classList.remove('active')
			}
		})

        // listen on changes
        document.removeEventListener('biddingInfoChange', changeBiddingInfo)
        document.addEventListener('biddingInfoChange', changeBiddingInfo)

        // load bidding information
        XHR.request({url:'./pages/bidding/info.html',method:'GET'}).then((data)=>{ 
            document.querySelector('div[name="/bids/info/details"]').innerHTML = data	
            window.bms.default.changeDisplay(['div[name="/bids/info"]'],'block')
            
            // show particulars
            ListUtil.loadBiddingParticulars(params.id)

            setTimeout(() => {
                // get info from database
                viewBiddingInfo(params.id)
			},100)   
			
			setTimeout(() => {
				InfoUtil.bindRemoveBidding()
				InfoUtil.bindSendBidding()
				InfoUtil.bindSetStatus()
				InfoUtil.bindChangeSignatories()
			},600)

        }).catch(err => { })
        

        // more settings
        setTimeout(() => {
            window.bms.default.dropdown('device-dropdown')	
			window.bms.default.lazyLoad(['./assets/js_native/assets/js/modules/Bidding/Util/AttachmentsModal.js'])
			window.bms.default.lazyLoad(['./assets/js_native/assets/js/modules/Bidding/Util/Feedback/Bidding.js'])
        },800)    
   },
   '/bids/forms/registration/*': (params) => {
		// load bidding list
		if (!document.querySelector('.list')) {
			ListUtil.lists({ token : window.localStorage.getItem('token') }) 
		}
	   window.bms.default.lazyLoad(['./assets/js_native/assets/js/routers/bidding/registration.js'],{once:true})
	   window.bms.default.loadCSS('assets/css/modules/suppliers/list.css')
   },
   '/bids/reports/': (params) => {
	   window.bms.default.changeDisplay(['.inv-router-section', '.bids-router-section', '.feedback-router-section'],'none')
	   window.bms.default.changeDisplay(['.bids-router-reports-section'],'block')
	   window.bms.default.activeMenu('bids-menu-list-reports')
	   
	   var url=`pages/bidding/reports/index.html`
	   return XHR.request({method:'GET',url:url}).then(res => {
		   let targ = document.getElementById('bids-router-reports-section')
		   targ.innerHTML = res
		   window.bms.default.scriptLoader(targ)
	   })
	   loadCSS('assets/css/fileicon.css')
   },
}).resolve()