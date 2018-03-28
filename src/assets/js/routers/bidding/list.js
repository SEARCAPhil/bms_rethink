import { Attachments } from '../../modules/Bidding/Util/Attachments.js'
import IndexedDB from '../../modules/Bidding/Util/Storage/Bidding'
import IndexedDBReq from '../../modules/Bidding/Util/Storage/Requirements'
import IndexedDBPart from '../../modules/Bidding/Util/Storage/Particulars'
import ListTemplate from '../../modules/Bidding/Templates/List/List'
import ListService from '../../modules/Bidding/Services/List/List'
import ListUtilities from '../../modules/Bidding/Util/List/List.js'
import ParticularUtilities from '../../modules/Bidding/Util/Particulars.js'
import RequirementsUtilities from '../../modules/Bidding/Util/Requirements.js'
import PopupES from '../../Components/PopupES/PopupES.js'

const appRoute = new window.bms.exports.Router('http://127.0.0.1/bms_rethink/www/',true)
const IDB = new IndexedDB()
const IDBReq = new IndexedDBReq()
const IDBPart = new IndexedDBPart()

const XHR = new window.bms.exports.XHR()
let DB = new window.bms.exports.IndexedDB()

window.bms.templates=window.bms.templates||{}
window.bms.templates.biddingList=ListTemplate

const AttUtil = new Attachments()
const List = new ListTemplate()
const listUtil = new ListUtilities()
const ListServ = new ListService()
const PartUtil = new ParticularUtilities()
const ReqUtil = new RequirementsUtilities()

let PopupInstance = {}



const viewBiddingInfo = (id) => {
	ListServ.view({id: id, token : window.localStorage.getItem('token')}).then(data => {

		const parsedData=JSON.parse(data)
		const json=parsedData.data
		json[0].id = parseInt(json[0].id)
		json[0].status = parseInt(json[0].status)

		var e = new CustomEvent('biddingInfoChange', {detail: json})
		document.dispatchEvent(e)

		// save to storage
		IDB.set(json[0])

		// save particulars to storage
		json[0].particulars.forEach((val, index) => {
			// return an int
			val.id = parseInt(val.id)
			val.bidding_id = parseInt(val.bidding_id)
			// save 
			IDBPart.set(val)

			// requirements
			val.requirements.forEach((res, i) => {
				res.id = parseInt(res.id)
				res.particular_id = parseInt(res.particular_id)
				IDBReq.set(res)
			})
		})
		
	})	
}


const changeBiddingInfo = (e) => {
	const details = e.detail[0]
	const collabsSec = document.getElementById('bidding-collaborators')
	const attSec = document.getElementById('attacments-info-section')

	document.getElementById('bidding-created-by-info').innerHTML = `${details.profile_name}`
	document.getElementById('bidding-name').innerHTML = `${details.name}`
	document.getElementById('bidding-number-info').innerHTML = `#${details.id}`
	document.getElementById('bidding-description-info').innerHTML = `${details.description}`
	document.getElementById('bidding-deadline-info').innerHTML = `${details.deadline !== '0000-00-00' ? details.deadline : 'N/A'}`
	document.getElementById('bidding-excemption-info').innerHTML = `${details.excemption == 1 ? 'YES' : 'NO'}`
	document.getElementById('bidding-date-created').innerHTML = `${details.date_created}`

	// clear section
	document.getElementById('particulars-section').innerHTML = ''
	collabsSec.innerHTML = ''
	attSec.innerHTML = ''


	if (details.particulars) {
		for (let x = 0; x < details.particulars.length; x++) {
			// particulars
			appendParticulars(details.particulars[x])
			
		}
	}

	// email
	if (details.collaborators) {
		for (var i = 0; i < details.collaborators.length; i++) {
			collabsSec.innerHTML += `<span class="">${details.collaborators[i].email};</span> `
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
		PopupInstance = new PopupES()
		// remove attachments
		AttUtil.bindRemoveAttachments()
	}, 1000);


	
}

const appendAttachments = (data) => {
	const attSec = document.getElementById('attacments-info-section')
	attSec.innerHTML += `	<div class="col-lg-3 col-md-3" style="padding:5px;background:#e9ecef;border:1px solid #fefefe;position:relative;">
								<div class="d-flex align-items-stretch">

									<div class="col">
										<div class="file-icon file-icon-sm" data-type="${data.type}"></div> ${data.original_filename}
									</div>

									<div class="col-1">
										<i class="material-icons md-18 device-dropdown" data-device-dropdown="dropdown-${data.id}" data-resources="${data.id}">arrow_drop_down</i>
										<div class="dropdown-section float-right" id="dropdown-${data.id}">
											<ul class="list-group list-group-flush">
	  											<li class="list-group-item "><a href="#" onclick="event.preventDefault();window.open('http://192.168.80.56/bms_api/src/api/bidding/attachments/download.php?id=${data.id}')">Download</a></li>
												<li class="list-group-item"><a data-target="#bidding-modal" data-popup-toggle="open" href="#" class="remove-attachments-modal">Remove</a></li>
											<ul>
										</div>
									</div>
								</div>
							</div>`
}

const appendParticulars = (data) => {
	let html = `
		<small class="particulars">
	    	<details>
	    		<summary class="text-info">
	    			${data.name}
	    			<span class="float-right text-danger"></span>

	    		</summary>
	    		<div class="col-lg-12" style="padding-top:5px;padding-bottom:5px;background:#f6f6f6;">
	    			
	    			<p>
	    				<span class="badge badge-danger">${data.requirements.length}</span> <span class="text-danger">Requirements &emsp;<u><a href="#/bids/forms/registration/${data.id}/steps/3">Add New</a></u></spn>
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

    	html +=`	<span>
    					<a href="#/bids/forms/registration/${data.requirements[x].id}/steps/3/update"><i class="material-icons md-12 text-muted">edit</i></a>
    					<a href="#" class="remove-requirements-modal-btn" data-target="#bidding-modal" data-popup-toggle="open" id="${data.requirements[x].id}"><i class="material-icons md-12 text-muted" id="${data.requirements[x].id}">remove_circle_outline</i></a>&emsp;
    				</span>
    				<span class="float-right text-danger">${data.requirements[x].budget_currency} ${data.requirements[x].budget_amount}</span><br/>
    				<span class="text-muted">${data.requirements[x].bidding_excemption_request ===1 ? 'For bidding excemption' : ''}</span>
    			</p>
    		</section>
		`
	}

	html +=`
	    		</div>
	    	</details>
	    	<div class="col-lg-12">
		    	<span class="deadline">
		    		<b>Deadline</b> : ${data.deadline}<br/>
		    		<!--menu -->
		    		<span class="particulars-menu" style="visibility:hidden;">
	    				<a href="#" class="remove-particulars-modal" data-target="#bidding-modal" data-popup-toggle="open" id="${data.id}">Remove</a>&emsp;

	    				<a href="#/bids/forms/registration/${data.id}/steps/2/${encodeURIComponent(data.name)}/${data.deadline}">Edit</a>&emsp;<br/>

	    			</span>
		    	</span>
		    </div>
	    </small>
	`
	document.getElementById('particulars-section').innerHTML += html

	PopupInstance = new PopupES()

	// remove particulars
	PartUtil.bindRemoveParticulars()
	// remove requirements
	ReqUtil.bindRemoveRequirements()
}


appRoute.on({
	'*': () => {

	},
	'/bids/all': () => {
		// listUtil.listsFromLocal({filter: 'all'})
		listUtil.lists({token : window.localStorage.getItem('token')})
	},
	'/bids/drafts': () => {
		// listUtil.listsFromLocal({filter: 'drafts'})
		listUtil.lists({filter: 'drafts', token : window.localStorage.getItem('token')})
	},
	'/bids/:id/info/': (params) => {

		document.removeEventListener('biddingInfoChange', changeBiddingInfo)
		document.addEventListener('biddingInfoChange', changeBiddingInfo)

		viewBiddingInfo(params.id)
		// more settings
		setTimeout(() => {
			window.bms.default.dropdown('device-dropdown')	
			window.bms.default.lazyLoad(['./assets/js_native/assets/js/modules/Bidding/Util/AttachmentsModal.js'])
		},800)


		// show list onpageloaded
		if (!document.querySelector('.list')) {
			//listUtil.listsFromLocal({filter: 'all'})
			listUtil.lists({ token : window.localStorage.getItem('token') })
		}

		// clear settings
		window.bms.bidding.requirements = window.bms.bidding.requirements || {}
		window.bms.bidding.requirements.fundToRemove =  {}

	},
	'/bids/requirements/:id': (params) => {

		// show list onpageloaded
		if (!document.querySelector('.list')) {
			// listUtil.listsFromLocal({filter: 'all'})
			listUtil.lists()
		}
	},
	'/bids/requirements/:id/proposal/form': (params) => {

		// show list onpageloaded
		if (!document.querySelector('.list')) {
			//listUtil.listsFromLocal({filter: 'all'})
			listUtil.lists({ token : window.localStorage.getItem('token') })
		}
	},
}).resolve()