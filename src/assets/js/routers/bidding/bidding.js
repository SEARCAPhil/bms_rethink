import IndexUtilities from '../../modules/Bidding/Util/Index/Index.js'
import InfoUtilities from '../../modules/Bidding/Util/Info.js'
import IndexedDB from '../../modules/Bidding/Util/Storage/Bidding'
import IndexedDBReq from '../../modules/Bidding/Util/Storage/Requirements'

const appRoute = new window.bms.exports.Router('http://127.0.0.1/bms_rethink/www/',true)
const IDB = new IndexedDB()
const IDBReq = new IndexedDBReq()
const IndexUtil = new IndexUtilities()
const InfoUtil = new InfoUtilities()

window.bms.default.pages = []
window.bms.default.spinner = new window.bms.exports.Spinner({
	target:'body',
	class:'spinner'
})



const loadCSS = (href) => {
	let css = document.createElement('link')
	css.type= 'text/css'
	css.rel = 'stylesheet'
	css.href = href
	document.body.append(css)
}

const appendReqAttachments = (data) => {
	const attSec = document.getElementById('attachments-requirements-info-section')
	attSec.innerHTML += `	<div class="col-lg-3 col-md-3" style="padding:5px;background:#e9ecef;border:1px solid #fefefe;">
									<div class="file-icon file-icon-sm" data-type="${data.type}"></div> ${data.original_filename}
									<i class="material-icons md-12">arrow_drop_down</i>
								</div>`
}

appRoute.on({
 	'/*': () => {
 		// this is required to always treat suppliers as separate route
 		// without this, link will stop working after a few clicks
 	},
	'/bids/*': () => {
		IndexUtil.loadBiddingListSection()
		IndexUtil.loadBiddingInitialPage()
		loadCSS('assets/css/modules/suppliers/list.css')
	},
	'/bids/:id/info/': (params) => {
		window.bms.default.state.bidding.cur.bid.id = params.id
		window.bms.default.changeDisplay(['div[name="/bids/initial"]','div[name="/bids/forms/registration/2"]','div[name="/bids/forms/registration"]','div[name="/bids/forms/registration/3"]'],'none')
		
		// get bidding information
		IndexUtil.loadBiddingInfo(params.id).then(() => {
			IDB.get(params.id).then((json) => {	
				document.dispatchEvent(new CustomEvent('biddingInfoChange', {detail: [json]}))
			})
		}).catch(err => {

		})
		// show particulars
		IndexUtil.loadBiddingParticulars(params.id)
		IndexUtil.loadBiddingListSection()

		// TODO : include script in other js to lessen file size
		// however additional XHR is required
		setTimeout(() => {
			InfoUtil.bindRemoveBidding()
			InfoUtil.bindSendBidding()
			InfoUtil.bindSetStatus()
		},100)
		// load external css
		loadCSS('assets/css/modules/suppliers/list.css')
		loadCSS('node_modules/fileicon/fileicon.css')
	},
	'/bids/requirements/:id': (params) => {
		window.bms.default.changeDisplay(['div[name="/bids/initial"]','div[name="/bids/forms/registration/2"]','div[name="/bids/forms/registration"]','div[name="/bids/forms/registration/3"]','div[name="/bids/info"]'],'none')
		IndexUtil.loadBiddingRequirementsInfo()
		IndexUtil.loadBiddingListSection()

		const targ = document.querySelector('.specs-section-info')
		const attTarg = document.getElementById('attacments-requirements-info-section')
		window.bms.default.lazyLoad(['./assets/js_native/assets/js/modules/bidding/Util/Attachments/Requirements.js'])

		// get requirements
		IDBReq.get(params.id).then((json) => {
			if (json.id) {
				document.querySelector('.req-name').textContent = json.name
				document.querySelector('.req-currency').textContent = json.budget_currency
				document.querySelector('.req-amount').textContent = json.budget_amount
				document.querySelector('.req-quantity').textContent = json.quantity
				document.querySelector('.req-unit').textContent = json.unit

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
					appendReqAttachments({type: val.type, original_filename: val.original_filename })
				})

			}
		})

		loadCSS('assets/css/modules/suppliers/list.css')
		loadCSS('node_modules/fileicon/fileicon.css')
	},
	'/bids/forms/registration/*': (params) => {
		IndexUtil.loadBiddingListSection()
		window.bms.default.lazyLoad(['./assets/js_native/assets/js/routers/bidding/registration.js'],{once:true})
		loadCSS('assets/css/modules/suppliers/list.css')
	}
}).resolve()