import ListUtilities from '../modules/Bidding/Util/List/List.js'
import IndexUtilities from '../modules/Bidding/Util/Index/Index'
const IndexUtil = new IndexUtilities()
const ListUtil = new ListUtilities()
const XHR = new window.bms.exports.XHR()
const appRoute = new window.bms.exports.Router('http://127.0.0.1/bms_rethink/www/',true)
const appRoute2 = new window.bms.exports.Router('http://127.0.0.1/bms_rethink/www/',true)

let PopupInstance = {}

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


// MENU based on status
const showBiddingReqSent = () => {
	const targ = document.getElementById('detail-info-menu-status')
    targ.innerHTML = `<center class="row" style="background:#0c5460;color:#fff;padding:5px;">
		<p class="col-12">
        	 Bidding Request Sent. You Are not able to modify the content of this bidding request. 
        </p>
    </center>`
}


const showBiddingReqApprove = () => {
	const targ = document.getElementById('detail-info-menu-status')

	targ.innerHTML = `<center class="row" style="background:#495057;color:#fff;padding:5px;">
		<p class="col-12">
        	This Bidding request Is for approval. Make sure you review this request before making any further actions.  <span id="disapprove-btn-section"></span> <span id="approve-btn-section"></span> 
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


const showBiddingApprove = () => {
	const targ = document.getElementById('detail-info-menu-status')
	targ.innerHTML = `<center class="row" style="background:#dee2e6;color:#6c757d;padding:5px;">
		<p class="col-12">
        	This Bidding request was approved. You may close this bidding request now <span id="failed-btn-section"></span> <span id="close-btn-section"></span>
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


const showBiddingApproveReadOnly = () => {
	const targ = document.getElementById('detail-info-menu-status')
	targ.innerHTML = `<center class="row" style="background:#495057;color:#e6e6e6;padding:5px;">
		<p class="col-12">
        	This Bidding request was approved. You may now invite suppliers to bid on this request
        </p>
    </center>`

}



const showBiddingReqReturned = () => {
	const targ = document.getElementById('detail-info-menu-status')
	targ.innerHTML = `<center class="row" style="background:#0c5460;color:#fff;padding:5px;">
		<p class="col-12">
        	This Bidding request was returned. Make sure that all details are complete and follow the bidding request standard procedures
        </p>
    </center>`
}

const showBiddingClosed = () => {
	const targ = document.getElementById('detail-info-menu-status')
	targ.innerHTML = `<center class="row" style="background:#0c5460;color:#fff;padding:5px;">
		<p class="col-12">
        	This Bidding request is already closed. <i class="material-icons">lock</i>
        </p>
    </center>`
}



const showBiddingFailed = () => {
	const targ = document.getElementById('detail-info-menu-status')
	targ.innerHTML = `<center class="row" style="background:#dc3545;color:#fff;padding:5px;">
		<p class="col-12">
        	This bidding request has been closed due to failure of bidding. Fore more info. please contact the Administrator<i class="material-icons">lock</i>
        </p>
    </center>`
}



const showBiddingDisapproved = () => {
	const targ = document.getElementById('detail-info-menu-status')
	targ.innerHTML = `<center class="row" style="background:#dc3545;color:#fff;padding:5px;">
		<p class="col-12">
        	This Bidding has been disapproved! This bidding request is now closed <i class="material-icons">lock</i>
        </p>
    </center>`
}


const showBiddingExemption = () => {
	const targ = document.getElementById('detail-info-menu-status')
	if(!document.getElementById('detail-info-menu-bidding-exemption')) {
		const status = document.createElement('center')
		status.classList.add('row')
		status.id = 'detail-info-menu-bidding-exemption'
		status.setAttribute('style', 'background:#dc355a;color:#fff;padding:5px;font-weight: bold;')
		status.innerHTML = `
			<p class="col-12">
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


const changeBiddingInfo = (e) => {
	const details = e.detail[0]
	const collabsSec = document.getElementById('bidding-collaborators')
	const attSec = document.getElementById('attacments-info-section')

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
	// document.getElementById('bidding-name').innerHTML = `${details.name}`
	document.getElementById('bidding-number-info').innerHTML = `#${details.id}`
	//document.getElementById('bidding-description-info').innerHTML = `${details.description}`
	//document.getElementById('bidding-deadline-info').innerHTML = `${details.deadline !== '0000-00-00' ? details.deadline : 'N/A'}`
	document.getElementById('bidding-excemption-info').innerHTML = `${details.excemption == 1 ? 'YES' : 'NO'}`
	document.getElementById('bidding-date-created').innerHTML = `${details.date_created}`
	document.getElementById('image-info-section').innerHTML = `${details.profile_name ? details.profile_name.substr(0,2).toUpperCase() : ''}`

	// clear section
	document.getElementById('particulars-section').innerHTML = ''
	collabsSec.innerHTML = ''
	attSec.innerHTML = ''


	if (details.particulars) {
		for (let x = 0; x < details.particulars.length; x++) {
			// particulars
			/////appendParticulars(details.particulars[x])
			
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
		///////appendAttachments(details.attachments[i])	
	}


	setTimeout(function() {
		// dropdown
		window.bms.default.dropdown('device-dropdown')
		// enable popup
		PopupInstance = new window.bms.exports.PopupES()
		// remove attachments
		//AttUtil.bindRemoveAttachments()
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

        if (!document.querySelector('.list')) {
            ListUtil.lists({ token : window.localStorage.getItem('token') }) 
        }
        
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

        }).catch(err => {

        })
        
        

        // more settings
        setTimeout(() => {
            window.bms.default.dropdown('device-dropdown')	
            window.bms.default.lazyLoad(['./assets/js_native/assets/js/modules/Bidding/Util/AttachmentsModal.js'])
        },800)

        

        
    

  
       /* // more settings
        setTimeout(() => { console.log(document.querySelector('.list'))

            if (!document.querySelector('.list-bids-container')) {
                ListUtil.lists({ token : window.localStorage.getItem('token') })  
            } else {
                            if (!document.querySelector('.list')) {
                    ListUtil.lists({ token : window.localStorage.getItem('token') })  
                } 
            }

     
        },2000) */
        
   },
}).resolve()