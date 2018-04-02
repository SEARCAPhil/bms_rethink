import ListService from '../Services/List/List'
import IndexedDB from '../Util/Storage/Bidding'

export default class {
	constructor () {
		this.XHR = new window.bms.exports.XHR()
		this.ListServ = new ListService()
		this.IDB = new IndexedDB()
	}

	removeBidding (e) {
		window.bms.default.spinner.show()
		const data = {
			id: window.bms.default.state.bidding.cur.bid.id,
			action: 'remove',
		}

		this.ListServ.remove(data).then((json) => {
			let res = JSON.parse(json)

			if(res.data == 1){
				// clear fields
				document.querySelector('[name="/bids/info/requirements"]').innerHTML = ''
				document.querySelector('[name="/bids/info/details"]').innerHTML = `
					<center style="margin-top:70px;" class="alert alert-success col-lg-8 offset-lg-2 col-12">
						<p>Deleted successfully! <i class="material-icons">check</i></p>
						<small><p>You will not be able to see this item on the system any longer.<br/> Please refresh your browser or select new bidding request</p></small>
					</center>
				`
				// close popup
				document.getElementById('bidding-modal').close()
				// remove from store
				// this.IDB.delete(data.id)

			}else{

			}

			window.bms.default.spinner.hide()
		})
	}

	showBiddingReqSent () {
		document.getElementById('detail-info-menu').innerHTML = `<center><p>
	        Bidding Request Sent. You Are not able to modify the content of this bidding request.</p>
	    </center>`
	}

	sendBidding (e) {
		window.bms.default.spinner.show()
		let cont = Object.keys(window.bms.bidding.CBASendingList)
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

		this.ListServ.send(data).then((json) => {
			let res = JSON.parse(json)

			if(res.data.length === data.emails.length) {
				this.showBiddingReqSent()

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

	setStatus (e) {
		window.bms.default.spinner.show()

		let data = {
			id: window.bms.default.state.bidding.cur.bid.id,
			status: e.target.resources,
		}

		this.ListServ.status(data).then((json) => {
			let res = JSON.parse(json)

			if(res){

			}

			window.bms.default.spinner.hide()
			document.getElementById('bidding-modal').close()
		}).catch((err) => {
			window.bms.default.spinner.hide()
			document.getElementById('bidding-modal').close()
		})
	}

	loadRemoveBidding (e) {
		const URL='pages/suppliers/modal/remove.html'
		const id=e.target.id
		const proto = Object.assign({ __proto__: this.__proto__ }, this)

		return this.XHR.request({method:'GET',url:URL}).then(res=>{
			let modalTarget=document.getElementById('modal-bidding-body')
			modalTarget.innerHTML=res

			setTimeout(()=>{
				// load external script
				window.bms.default.scriptLoader(modalTarget)

				//remove cancel
				document.getElementById('modal-dialog-close-button').addEventListener('click',()=>{
					document.getElementById('bidding-modal').close()		
				})

				let btn = document.getElementById('modal-dialog-remove-button')

				btn.el =  e.target
				btn.addEventListener('click', this.removeBidding.bind(proto))

			},50)

		}).catch(e=>{})
	}

	loadSendBidding (e) {
		const URL='pages/bidding/modal/send-to-cba.html'
		const id=e.target.id
		const proto = Object.assign({ __proto__: this.__proto__ }, this)

		return this.XHR.request({method:'GET',url:URL}).then(res=>{
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
				btn.addEventListener('click', this.sendBidding.bind(proto))
			},50)
		}).catch(e=>{})
	}


	loadSetStatus (e) {
		const URL='pages/bidding/modal/status.html'
		const id=e.target.id
		const proto = Object.assign({ __proto__: this.__proto__ }, this)

		return this.XHR.request({method:'GET',url:URL}).then(res=>{
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
				btn.resources = e.target.getAttribute('data-resources')
				btn.addEventListener('click', this.setStatus.bind(proto))
			},50)
		}).catch(e=>{})
	}


	bindRemoveBidding () {
		const proto = Object.assign({ __proto__: this.__proto__ }, this)
		document.querySelector('.remove-bidding-modal-btn').addEventListener('click',this.loadRemoveBidding.bind(proto))
	}


	bindSendBidding () {
		const proto = Object.assign({ __proto__: this.__proto__ }, this)
		document.querySelector('.send-bidding-modal-btn').addEventListener('click',this.loadSendBidding.bind(proto))
	}

	bindSetStatus () {
		const proto = Object.assign({ __proto__: this.__proto__ }, this)
		const el = document.querySelectorAll('.set-bidding-modal-btn')
		el.forEach((els, index) => {
			els.addEventListener('click',this.loadSetStatus.bind(proto))
		})
	}


	appendAttachments (data) {
		const attSec = document.getElementById('attacments-info-section')
		const att = document.createElement('div')
		att.classList.add('col-lg-3', 'col-md-3')
		att.setAttribute('style','padding:5px;background:#505050;border:1px solid #fefefe;color:#fff;')
		att.innerHTML = `	
							<div class="d-flex align-items-stretch">
								<div class="col-10">
									<div class="file-icon file-icon-sm" data-type="${data.type}"></div> ${data.original_filename}
								</div>
								<div class="col-2">
									<i class="material-icons md-18 device-dropdown" data-device-dropdown="dropdown-req-${data.id}" data-resources="${data.id}">arrow_drop_down</i>
									<div class="dropdown-section float-right" id="dropdown-req-${data.id}">
										<ul class="list-group list-group-flush">
  											<li class="list-group-item "><a href="#" onclick="event.preventDefault();window.open('http://192.168.80.56/bms_api/src/api/bidding/attachments/download.php?id=${data.id}')">Download</a></li>
											<li class="list-group-item"><a data-target="#bidding-modal" data-popup-toggle="open" href="#" class="remove-attachments-modal">Remove</a></li>
										<ul>
									</div>
								</div>
							</div>
								`
		attSec.append(att)
	}


}