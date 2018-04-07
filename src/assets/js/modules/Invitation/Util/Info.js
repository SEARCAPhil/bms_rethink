import PropService from '../Services/Proposal'


export default class {
	constructor () {
		this.XHR = new window.bms.exports.XHR()
		this.PropServ = new PropService()

	}

	setStatus (e) {
		const id =(e.target.el.getAttribute('data-resources'))
		const action =(e.target.el.action)

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


	loadRemove (e) {
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
				btn.el.action = 'remove'
				btn.addEventListener('click', this.setStatus.bind(proto))

			},50)

		}).catch(e=>{})
	}

	loadSend (e) {
		const URL='pages/bidding/modal/send-proposals.html'
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
				btn.el.action = 'send'
				btn.addEventListener('click', this.setStatus.bind(proto))

			},50)

		}).catch(e=>{})
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


	bindRemove () {
		const proto = Object.assign({ __proto__: this.__proto__ }, this)
		let ob = document.querySelector('.remove-prop-modal-btn')
		if (ob) ob.addEventListener('click',this.loadRemove.bind(proto))
	}

	bindSend () {
		const proto = Object.assign({ __proto__: this.__proto__ }, this)
		let ob = document.querySelector('.send-prop-modal-btn')
		if (ob) ob.addEventListener('click',this.loadSend.bind(proto))
	}

	bindRequestNewProposal () {
		const proto = Object.assign({ __proto__: this.__proto__ }, this)
		let ob = document.querySelector('.resend-prop-modal-btn')
		if (ob) ob.addEventListener('click',this.loadResend.bind(proto))
	}


}