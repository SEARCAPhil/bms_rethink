import PropService from '../Services/Proposal'
import ListService from '../Services/List'


export default class {
	constructor () {
		this.XHR = new window.bms.exports.XHR()
		this.PropServ = new PropService()
		this.ListServ = new ListService()
		this.timestamp = new Date().getTime()

	}

	get (id) { 
		//window.bms.default.spinner.show()
		let data = {
			id,
			token: window.localStorage.getItem('token'),
		}

		return new Promise((resolve, reject) => {
			this.ListServ.view(data).then((json) => {
				let res = JSON.parse(json)
			
				if(res[0]){
					window.bms.default.spinner.hide()
					resolve(res[0])
				}


			})
		})
	}

	setStatus (e) {
		const id = window.bms.default.state.proposals.cur.id
		const action =(e.target.el.action)

		// disable button
		e.target.setAttribute('disabled','disabled')

		const data = {
			id,
			token : window.localStorage.getItem('token'),
			action,
		}

		window.bms.default.spinner.show()

		

		this.PropServ.remove(data).then((data) => {

			if(data == 1){
				
				// close popup
				document.getElementById('bidding-modal').close()
				window.location.reload()

			}else{
				alert('Unable to process request. Please try again later')
				e.target.removeAttribute('disabled')
			}

			window.bms.default.spinner.hide()
		})
	}

	requestNew (e) {
		const id =(e.target.el.getAttribute('data-resources'))
		const reason = document.querySelector('textarea#reason').value

		if (reason.length > 5) {

			const data = {
				id,
				token : window.localStorage.getItem('token'),
				reason,
				action: 'change',
			}

			window.bms.default.spinner.show()

			

			this.PropServ.remove(data).then((data) => {

				if(data == 1){
					
					// close popup
					document.getElementById('bidding-modal').close()
					window.location.reload()

				}else{
					alert('Unable to process request. Please try again later')
				}

				window.bms.default.spinner.hide()
			})
		}

	}


	loadAwardRequirementsAttachmentsNotice (e) {

		const URL='pages/bidding/modal/award-attachments-notice.html'
		const proto = Object.assign({ __proto__: this.__proto__ }, this)
		const stat = document.querySelector('#prop-info-menu-status')

		// show reload status
		stat.innerHTML = '<center style="background:#007bff;color:#fff;padding:15px;">This bidding requirement has been modified. Please reload this page to see changes <u><a href="#" class="text-danger" onclick="event.preventDefault();window.location.reload();">reload</a><u></center>'
		// remove menu
		document.querySelector('#prop-info-menu').classList.add('hide')

		return this.XHR.request({method:'GET',url:URL}).then(res=>{
			let modalTarget=document.getElementById('modal-bidding-requirements-body')
			modalTarget.innerHTML=res

			setTimeout(()=>{
				window.bms.default.scriptLoader(modalTarget)
			},50)

			setTimeout(()=>{
				//remove cancel
				document.getElementById('modal-dialog-close-button').addEventListener('click',()=>{
		
					document.getElementById('bidding-requirements-modal').close()
					
				})

				let btn = document.getElementById('modal-dialog-send-button')

				btn.addEventListener('click', () => {
					// close modal then open the attachment sidebar
					document.getElementById('bidding-requirements-modal').close()
					document.querySelector('.file-prop-attachment-dialog-btn').click()
				})
			})


		}).catch(err=>{
			console.log(err)
		})
	}

	award (e) {
		const id =(e.target.el.getAttribute('data-resources'))
		window.bms.default.spinner.show()

		let data = {
			id,
			token: window.localStorage.getItem('token'),
			remarks: document.getElementById('award-remarks').value ,
			action: 'award',
		}

		this.PropServ.send(data).then((json) => {
			let res = JSON.parse(json)

			if( parseInt(res) > 0){
				//window.location.reload()
				// notify user to upload attachmet
				this.loadAwardRequirementsAttachmentsNotice().bind(proto)
			}

			window.bms.default.spinner.hide()
			
		}).catch(err => {
			window.bms.default.spinner.hide()
		})
	}

	setReferenceNo (e) {
		window.bms.default.spinner.show()
		let data = {
			id: window.bms.default.state.proposals.cur.id,
			token: window.localStorage.getItem('token'),
			ref: document.getElementById('form-ref-no').value,
			action: 'create',
		}

		this.PropServ.reference(data).then((json) => {
			let res = JSON.parse(json)

			if( parseInt(res) > 0){
				window.location.reload()
			} else {
				alert('Unable to set PR/PO number. Please try again later')
			}

			window.bms.default.spinner.hide()
			
		}).catch(err => {
			window.bms.default.spinner.hide()
		})
	}


	loadRemove (e) {
		const URL=`pages/suppliers/modal/remove.html?timestamp=${this.timestamp}`
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
				btn.el.action = 'remove'
				btn.addEventListener('click', this.setStatus.bind(proto))

			},50)

		}).catch(e=>{})
	}

	loadSend (e) {
		window.bms.default.spinner.show()
		const URL=`pages/bidding/modal/send-proposals.html?timestamp=${this.timestamp}`
		const id=e.target.id
		const proto = Object.assign({ __proto__: this.__proto__ }, this)
		// disable button
		

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

				let btn = document.getElementById('modal-dialog-send-button')

				btn.el =  e.target
				btn.el.action = 'send'
				btn.addEventListener('click', this.setStatus.bind(proto))

			},50)

			window.bms.default.spinner.hide()

		}).catch(e=>{
			window.bms.default.spinner.hide()
		})


	}

	loadResend (e) {
		const URL='pages/bidding/modal/request-proposal.html'
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

				let btn = document.getElementById('modal-dialog-send-button')

				btn.el =  e.target
				btn.el.action = 'resend'
				btn.addEventListener('click', this.requestNew.bind(proto))

			},50)

		}).catch(e=>{})
	}

	loadAwardRequirements (e) {
		const URL='pages/bidding/modal/award-proposal.html'
		const id=e.target.id
		const proto = Object.assign({ __proto__: this.__proto__ }, this)

		return this.XHR.request({method:'GET',url:URL}).then(res=>{
			let modalTarget=document.getElementById('modal-bidding-requirements-body')
			modalTarget.innerHTML=res

			setTimeout(()=>{
				window.bms.default.scriptLoader(modalTarget)
			},50)

			setTimeout(()=>{
				//remove cancel
				document.getElementById('modal-dialog-close-button').addEventListener('click',()=>{
		
					document.getElementById('bidding-requirements-modal').close()
					
				})

				let btn = document.getElementById('modal-dialog-send-button')
				btn.el =  e.target
				btn.addEventListener('click', this.award.bind(proto))
			})
		}).catch(e=>{})
	}


	loadProposalForm (e) {
		const URL='pages/bidding/forms/proposals/index.html'
		const target = document.getElementById('reg-prop-dialog-section')
		const proto = Object.assign({ __proto__: this.__proto__ }, this)
		const sec = document.querySelector('.specs-section-proposal')

		return new Promise((resolve, reject) => {
			if (sec) {
				resolve()
				return 0
			}

			this.XHR.request({method:'GET',url:URL}).then(res=>{
				target.innerHTML=res
				resolve(res)
			}).catch(e=>{})
		})

	}

	loadSetRefNo (e) {
		const URL='pages/bidding/modal/set-reference.html'
		const id=e.target.id
		const proto = Object.assign({ __proto__: this.__proto__ }, this)

		return this.XHR.request({method:'GET',url:URL}).then(res=>{
			let modalTarget=document.getElementById('modal-bidding-requirements-body')
			modalTarget.innerHTML=res

			setTimeout(()=>{
				window.bms.default.scriptLoader(modalTarget)
			},50)

			setTimeout(()=>{
				//remove cancel
				document.getElementById('modal-dialog-close-button').addEventListener('click',()=>{
		
					document.getElementById('bidding-requirements-modal').close()
					
				})

				let btn = document.getElementById('modal-dialog-send-button')
				btn.el =  e.target
				btn.addEventListener('click', this.setReferenceNo.bind(proto))
			})
		}).catch(e=>{})
	}




	bindRemove () {
		const proto = Object.assign({ __proto__: this.__proto__ }, this)
		let ob = document.querySelector('.remove-prop-modal-btn:not(.event-binded)')
		if (ob) {
			ob.classList.add('event-binded')
			ob.addEventListener('click',this.loadRemove.bind(proto))
		} 
	}

	bindSend () {
		const proto = Object.assign({ __proto__: this.__proto__ }, this)
		let ob = document.querySelector('.send-prop-modal-btn:not(.event-binded)')
		if (ob) {
			ob.classList.add('event-binded')
			ob.addEventListener('click',this.loadSend.bind(proto))
		} 
	}

	bindRequestNewProposal () {
		const proto = Object.assign({ __proto__: this.__proto__ }, this)
		let ob = document.querySelector('.resend-prop-modal-btn')
		if (ob) ob.addEventListener('click',this.loadResend.bind(proto))
	}


	bindAward () {
		const proto = Object.assign({ __proto__: this.__proto__ }, this)
		document.querySelectorAll('.award-prop-modal-btn').forEach((val, index) => {
			val.addEventListener('click',this.loadAwardRequirements.bind(proto))
		})
	}


	bindSetReferenceNo () {
		const proto = Object.assign({ __proto__: this.__proto__ }, this)
		document.querySelectorAll('.proposal-ref-dialog-btn').forEach((val, index) => {
			val.addEventListener('click',this.loadSetRefNo.bind(proto))
		})
	}





}