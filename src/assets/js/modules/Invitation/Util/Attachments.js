import AttachmentsService from '../Services/Attachments'
export class Attachments{
	constructor () {
		this.AttServ = new AttachmentsService()
		this.target = document.querySelector('#recently-attached-section-bidding')
		this.XHR = new window.bms.exports.XHR()

	}

	appendFileToBeUploaded (e) {
		const targ = document.querySelectorAll('.recently-attached-prop-section')

		// close dialog
		document.querySelector('#file-attachment-main-dialog-prop-modal').classList.remove('open')

		targ.forEach((el, index) => {
			for (var i = 0; i < e.target.files.length; i++) {
				// add to DOM
				el.innerHTML+=`
					<div class="col-lg-3" style="padding:5px;border:1px solid #dc3545;font-size:smaller;margin:1px;">
							<div class="file-icon file-icon-sm" data-type="${e.target.files[i].type.split('/')[1]}"></div> 
								${e.target.files[i].name}
							<i class="material-icons md-12">arrow_drop_down</i>
							<div class="progress" style="height:3px;">
							  	<div class="progress-bar" id="progress-bar-${i}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="background:#dc3545;"></div>
							</div>
						</div>
				`

				// add to file uploader
				this.upload(e.target.files[i], i)	
			}
		})

	}

	appendAttachments (data) {
		const attSec = document.getElementById('attachment-prop-pool-section')
		const att = document.createElement('div')
		att.classList.add('col-lg-3', 'col-md-3')
		att.setAttribute('style','padding:5px;background:#505050;border:1px solid #fefefe;color:#fff;')
		att.innerHTML = `	
							<div class="d-flex align-items-stretch">
								<div class="col-8">
									<div class="file-icon file-icon-sm" data-type="${data.type}"></div> ${data.original_filename}
								</div>
								<div class="col-3">
									<i class="material-icons md-18 device-dropdown" data-device-dropdown="dropdown-req-${data.id}" data-resources="${data.id}">arrow_drop_down</i>
									<div class="dropdown-section float-right" id="dropdown-req-${data.id}">
										<ul class="list-group list-group-flush">
  											<li class="list-group-item "><a href="#" onclick="event.preventDefault();window.open('${window.bms.config.network}/bidding/invitations/attachments/download.php?id=${data.id}')">Download</a></li>
											<li class="list-group-item"><a data-target="#bidding-modal" data-popup-toggle="open" href="#" class="remove-prop-attachments-modal">Remove</a></li>
										<ul>
									</div>
								</div>
							</div>
								`
		attSec.append(att)
	}


	upload(file,index) {
		const formData = new FormData() 
		formData.append('files', file)
		formData.append('id', window.bms.default.state.proposals.cur.id)
		formData.append('token', window.localStorage.getItem('token'))

		let request = new XMLHttpRequest();


		request.open("POST", `${window.bms.config.network}/bidding/invitations/attachments/`);

		request.upload.addEventListener('progress', (e) => {
			let targ = document.getElementById(`progress-bar-${index}`)
			if (e.lengthComputable) {
				let total = (e.total / e.loaded ) * 100
				targ.style.width=`${total}%`
			}
		})

		request.addEventListener('load', (e) => {
			
			let targ = document.getElementById(`progress-bar-${index}`)

			if(request.responseText > 0) {
				targ.parentNode.parentNode.remove()
				// DOM
				const d = {
					id: request.responseText,
					type: file.type.split('/')[1],
					original_filename: file.name,
				}


				this.appendAttachments(d)
				// more settings
				setTimeout(() => {
					const pop = new window.bms.exports.PopupES()
					window.bms.default.dropdown('device-dropdown')	
					// remove attachments
					this.bindRemoveAttachments()

				},1000)
					
			}else{
				targ.parentNode.textContent = 'Error uploading'
			}
		})

		request.send(formData);

	}


	removeAttachments (e) {

		window.bms.default.spinner.show()
		e.target.setAttribute('disabled', 'disabled')

		let data = {
			id: window.bms.default.modal.resources,
			action: 'remove',
			token: window.localStorage.getItem('token'),
		}

		this.AttServ.remove(data).then((json) => {
			let res = JSON.parse(json)

			if(res.data){
				window.bms.default.modal.element.parentNode.parentNode.parentNode.remove()
				document.getElementById('bidding-modal').close()
				window.bms.default.spinner.hide()
			}else{
				document.querySelector('#bidding-modal > .content > .body').innerHTML = `
					<div class="col text-center">
						<h3 class="text-danger">Failed</h3>
						<p class="text danger">Unable To Remove this Item. Please try again later</p>
					</div>
				`
				window.bms.default.spinner.hide()
			}
		}).catch((err) => {
			window.bms.default.spinner.hide()
		})
	}



	bindSelectDeviceFile () {
		const el = document.querySelector('#file-upload-attachment-prop-modal:not(.event-binded)')
		const proto = Object.assign({__proto__: this.__proto__}, this)

		if (el) {
			el.classList.add('event-binded')
			el.removeEventListener('change', this.appendFileToBeUploaded.bind(proto))
			el.addEventListener('change', this.appendFileToBeUploaded.bind(proto))
			
		}

	}

	loadRemoveAttachments (e) {
		const URL='pages/suppliers/modal/remove.html'
		const id=e.target.id
		const proto = Object.assign({ __proto__: this.__proto__ }, this)

		return this.XHR.request({method:'GET',url:URL}).then(res=>{
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
				btn.addEventListener('click', this.removeAttachments.bind(proto))
			})
		}).catch(e=>{})
	}


	bindRemoveAttachments () {
		const proto = Object.assign({ __proto__: this.__proto__ }, this)
		document.querySelectorAll('.remove-prop-attachments-modal').forEach((val, index) => {
			val.addEventListener('click',this.loadRemoveAttachments.bind(proto))
		})
	}



}
