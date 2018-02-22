import IndexUtilities from '../../modules/Bidding/Util/Index/Index.js'
import ListUtilities from '../../modules/Bidding/Util/List/List.js'
import ListTemplate from '../../modules/Bidding/Templates/List/List'
import ListService from '../../modules/Bidding/Services/List/List'


const appRoute = new window.bms.exports.Router('http://127.0.0.1/bms_rethink/www/',true)
const appRouteProd = new window.bms.exports.Router('http://127.0.0.1/bms_rethink/www/',true)
const XHR = new window.bms.exports.XHR()


const IndexUtil = new IndexUtilities()
const listUtil = new ListUtilities()
const ListTemp = new ListTemplate()
const ListServ = new ListService()

let DB = new window.bms.exports.IndexedDB()


window.bms.default.pages = []
window.bms.default.spinner = new window.bms.exports.Spinner({
	target:'body',
	class:'spinner'
})



const loadCSS = () => {
	let css = document.createElement('link')
	css.type= 'text/css'
	css.rel = 'stylesheet'
	css.href = 'assets/css/modules/suppliers/list.css'
	document.body.append(css)
}

const viewBiddingInfoLocal = (id) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			let trans = DB.open('bidding')
			const local = trans.get(parseInt(id))
			local.onsuccess = () => { 
				// if contains data
				if (local.result) {
					const e = new CustomEvent('biddingInfoChange', {detail: [local.result]})
					document.dispatchEvent(e)
					resolve(local.result)	
				}else{
					reject()	
				}
				
			}

			local.onerror = (err) => {
				reject(err)
			}

		},100)
	})
}

const getReqInfoFromLocal = (id) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			let trans = DB.open('requirements')
			const local = trans.get(parseInt(id))
			local.onsuccess = () => { 
				resolve(local.result)
			}
			local.onerror = (err) => {
				reject(err)
			}
		},100)	
	})

}

const removeBiddingInfoFromLocal = (id) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			let trans = DB.open('bidding')
			const local = trans.delete(parseInt(id))
			local.onsuccess = () => { 
				resolve(local.result)
			}
			local.onerror = (err) => {
				reject(err)
			}
		},100)	
	})

}

const removeBidding = (e) => {
	window.bms.default.spinner.show()
	let data = {
		id: window.bms.default.state.bidding.cur.bid.id,
		action: 'remove',
	}

	ListServ.remove(data).then((json) => {
		let res = JSON.parse(json)

		if(res.data == 1){
			// clear fields
			document.querySelector('[name="/bids/info/requirements"]').innerHTML = ''
			document.querySelector('[name="/bids/info/details"]').innerHTML = `
				<center style="margin-top:70px;" class="text-success">
					<p>Deleted successfully! <i class="material-icons">check</i></p>
				</center>
			`
			// remove from store
			removeBiddingInfoFromLocal(data.id)

		}else{

		}

		window.bms.default.spinner.hide()
		
	})
}


const sendBidding = (e) => {
	window.bms.default.spinner.show()
	let targ = document.getElementById('bidding-collaborator-email')
	let cont = targ.textContent.trim().split(' ')
	let emails = []

	// removed unwanted spaces
	cont.forEach((val, index) => {
		if(val.trim().length > 0) emails.push(val)
	})

	// must contain atleast 1 email
	if(emails.length < 1) {
		alert('Unable to send this request. Please try again later')
		window.bms.default.spinner.hide()
		document.getElementById('bidding-modal').close()
		return 0
	} 

	let data = {
		id: window.bms.default.state.bidding.cur.bid.id,
		emails: emails,
		action: 'create',
	}

	ListServ.send(data).then((json) => {
		let res = JSON.parse(json)

		if(res.data.length === data.emails.length) {
			document.getElementById('detail-info-menu').remove()
			document.getElementById('detail-info-collaborator').remove()
			document.getElementById('bidding-modal').close()
			//setBiddingStatusToSentFromLocal(data.id)
		}

		// sent but not with all
		if(res.data.length > 0 && res.data.length !== data.emails.length) {
			alert('Notice : Not all collaborators specified did not received this request.')
		}

		window.bms.default.spinner.hide()
		
	})
}

const loadRemoveBidding = (e) => {
	const URL='pages/suppliers/modal/remove.html'
	const id=e.target.id

	return XHR.request({method:'GET',url:URL}).then(res=>{
		let modalTarget=document.getElementById('modal-bidding-body')
		modalTarget.innerHTML=res

		setTimeout(()=>{
			window.bms.default.scriptLoader(modalTarget)
		},50)

		setTimeout(()=>{
			//remove cancel
			document.getElementById('modal-dialog-close-button').addEventListener('click',()=>{
	
				document.getElementById('bidding-modal').close()
				
			})

			let btn = document.getElementById('modal-dialog-remove-button')
			btn.el =  e.target
			btn.addEventListener('click', removeBidding)
		})
	}).catch(e=>{})
}

const loadSendBidding = (e) => {
	const URL='pages/bidding/modal/send.html'
	const id=e.target.id

	return XHR.request({method:'GET',url:URL}).then(res=>{
		let modalTarget=document.getElementById('modal-bidding-body')
		modalTarget.innerHTML=res

		setTimeout(()=>{
			window.bms.default.scriptLoader(modalTarget)
		},50)

		setTimeout(()=>{
			//remove cancel
			document.getElementById('modal-dialog-close-button').addEventListener('click',()=>{
	
				document.getElementById('bidding-modal').close()
				
			})

			let btn = document.getElementById('modal-dialog-send-button')
			btn.el =  e.target
			btn.addEventListener('click', sendBidding)
		})
	}).catch(e=>{})
}


const bindRemoveBidding = () => {
	// remove particulars
	document.querySelector('.remove-bidding-modal-btn').addEventListener('click',loadRemoveBidding)
}


const bindSendBidding = () => {
	// remove particulars
	document.querySelector('.send-bidding-modal-btn').addEventListener('click',loadSendBidding)
}


appRoute.on({
 	'/*': () => {
 		// this is required to always treat suppliers as separate route
 		// without this, link will stop working after a few clicks
 	},
	'/bids/*': () => {
		//window.bms.default.spinner.show()
		IndexUtil.loadBiddingListSection()
		IndexUtil.loadBiddingInitialPage()
		loadCSS()
		//viewBiddingListLocal()

	},
	'/bids/:id/info/': (params) => {
		window.bms.default.state.bidding.cur.bid.id = params.id
		window.bms.default.changeDisplay(['div[name="/bids/initial"]','div[name="/bids/forms/registration/2"]','div[name="/bids/forms/registration"]','div[name="/bids/forms/registration/3"]'],'none')
		
		IndexUtil.loadBiddingInfo(params.id).then(() => {
			viewBiddingInfoLocal(params.id).catch(() => {

			})
		}).catch(err => {

		})

		IndexUtil.loadBiddingParticulars(params.id)
		IndexUtil.loadBiddingListSection()

		setTimeout(() => {
			bindRemoveBidding()
			bindSendBidding()
		},100)

		loadCSS()
	},
	'/bids/particulars/:pid': (params) => {
		window.bms.default.changeDisplay(['div[name="/bids/initial"]','div[name="/bids/forms/registration/2"]','div[name="/bids/forms/registration"]','div[name="/bids/forms/registration/3"]','div[name="/bids/info"]'],'none')
		IndexUtil.loadBiddingParticularsInfo()
		//RegUtil.loadBiddingParticularsProducts()
	},
	'/bids/requirements/:id': (params) => {
		window.bms.default.changeDisplay(['div[name="/bids/initial"]','div[name="/bids/forms/registration/2"]','div[name="/bids/forms/registration"]','div[name="/bids/forms/registration/3"]','div[name="/bids/info"]'],'none')
		IndexUtil.loadBiddingRequirementsInfo()
		IndexUtil.loadBiddingListSection()

		const targ = document.querySelector('.specs-section-info')
		getReqInfoFromLocal(params.id).then((json) => {
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

			}
		})
		loadCSS()
	},
	'/bids/forms/registration/*': (params) => {
		IndexUtil.loadBiddingListSection()
		window.bms.default.lazyLoad(['./assets/js_native/assets/js/routers/bidding/registration.js'],{once:true})
		// show list onpageloaded
		if (!document.querySelector('.list')) {
			listUtil.listsFromLocal({filter: 'all'})
			listUtil.lists()
		}
		
		loadCSS()
	}
}).resolve()