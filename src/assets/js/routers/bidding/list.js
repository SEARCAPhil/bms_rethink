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

const List = new ListTemplate()
const listUtil = new ListUtilities()
const ListServ = new ListService()
const PartUtil = new ParticularUtilities()
const ReqUtil = new RequirementsUtilities()

let PopupInstance = {}



const viewBiddingInfo = (id) => {
	ListServ.view({id, token: 'abc'}).then(data => {

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
	document.getElementById('bidding-name').innerHTML = `${details.name}`
	document.getElementById('bidding-number-info').innerHTML = `#${details.id}`
	document.getElementById('bidding-description-info').innerHTML = `${details.description}`
	document.getElementById('bidding-deadline-info').innerHTML = `${details.deadline !== '0000-00-00' ? details.deadline : 'N/A'}`
	document.getElementById('bidding-date-created').innerHTML = `${details.date_created}`

	// clear section
	document.getElementById('particulars-section').innerHTML = ''
	collabsSec.innerHTML = ''


	if (details.particulars) {
		for (let x = 0; x < details.particulars.length; x++) {
			// particulars
			appendParticulars(details.particulars[x])
			
		}
	}

	// email
	for (var i = 0; i < details.collaborators.length; i++) {
		collabsSec.innerHTML += `<span class="badge badge-md badge-pill badge-dark">${details.collaborators[i].email}</span> `
	}
	
}

const appendParticulars = (data) => {
	let html = `
		<small class="particulars">
	    	<details>
	    		<summary class="text-info">
	    			${data.name}
	    			<span class="float-right text-danger"></span>

	    		</summary>
	    		<div class="col-lg-12" style="padding-top:5px;">
	    			
	    			<p>
	    				<span class="badge badge-danger">${data.requirements.length}</span> <span class="text-danger">Requirements</spn>
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
    						<span class="text-danger badge">${data.requirements[x].funds[y].fund_type} - ${data.requirements[x].funds[y].cost_center} - ${data.requirements[x].funds[y].line_item}</span>
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
		listUtil.listsFromLocal({filter: 'all'})
		listUtil.lists()
	},
	'/bids/drafts': () => {
		listUtil.listsFromLocal({filter: 'drafts'})
		listUtil.lists({filter: 'drafts'})
	},
	'/bids/:id/info/': (params) => {

		document.removeEventListener('biddingInfoChange', changeBiddingInfo)
		document.addEventListener('biddingInfoChange', changeBiddingInfo)
		viewBiddingInfo(params.id)

		// show list onpageloaded
		if (!document.querySelector('.list')) {
			listUtil.listsFromLocal({filter: 'all'})
			listUtil.lists()
		}

		window.bms.default.lazyLoad(['./assets/js_native/assets/js/modules/Bidding/Util/Attachments.js'])
	}
}).resolve()