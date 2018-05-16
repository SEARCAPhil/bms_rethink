import AttachmentsService from '../../Services/Requirements'
import AttachmentsDialog from '../../../../components/FileDialog/Dialog'
import ReqUtilities from '../Requirements'

export class AttachmentsReq{
	constructor () {
		this.AttServ = new AttachmentsService()
		this.ReqUtil = new ReqUtilities()
		this.target = document.querySelector('#recently-attached-section-requirements')
		this.XHR = new window.bms.exports.XHR()

	}

	recent () {
		this.AttServ.recent({ token: window.localStorage.getItem('token')}).then(json => {
			const data = JSON.parse(json)
			if (data.data) {
				data.data.forEach((val, index) => {
					this.showRecent(val)
				})
				
			}
		})

	}

	attach (e) {
		// disable button first
		e.target.setAttribute('disabled', 'disabled')

		this.AttServ.attach({attachments:window.bms.bidding.files.recentFilesToUpload, action: 'create', id: window.bms.default.state.bidding.cur.requirements.id}).then(json => {
			const data = JSON.parse(json)

			//show in DOM
			if (data.data) {

				for (var i = 0; i < data.data.length; i++) {

					const d = {
						id: data.data[i].id,
						type: data.data[i].type,
						original_filename: data.data[i].original_filename,
					}
					this.ReqUtil.appendAttachments(d)
					// more settings
					setTimeout(() => {
						const pop = new window.bms.exports.PopupES()
						window.bms.default.dropdown('device-dropdown')	
						// remove attachments
						this.bindRemoveAttachments()

					},1000)
				}

				// close dialog
				document.querySelector('.file-attachment-main-dialog').classList.remove('open')
			}

			e.target.removeAttribute('disabled')

		}).catch((err) => {
			e.target.removeAttribute('disabled')
		})
	}

	showRecent (json) {
		const html = document.createElement('div')

		window.bms.bidding.files = window.bms.bidding.files || {}
		window.bms.bidding.files.recentFilesToUpload = window.bms.bidding.files.recentFilesToUpload  || {}

		html.classList.add('recently-attached-requirements')

		html.innerHTML = `<input type="checkbox" class="attachment-recent-checkbox-requirements" data-resources="${json.id}" data-original-filename="${json.original_filename}"> 
							<div class="file-icon file-icon-sm" data-type="${json.type}"></div> 
							<a href="#">${json.original_filename}</a> 
							<small class="text-muted"> (${json.size}KB&emsp;${json.date_created})</small>`

		this.target.append(html)
		this.bindSelectFile()
	}


	appendFileToBeUploaded (e) {
		const targ = document.querySelectorAll('.attachment-requirements-pool-section')

		// close dialog
		document.querySelector('#file-attachment-main-dialog-requirements').classList.remove('open')

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

	upload(file,index) {
		const formData = new FormData() 
		formData.append('files', file)
		formData.append('id', window.bms.default.state.bidding.cur.requirements.id)
		formData.append('token', window.localStorage.getItem('token'))

		let request = new XMLHttpRequest();


		request.open("POST", `${window.bms.config.network}/bidding/requirements/attachments/`);

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

				this.ReqUtil.appendAttachments(d)

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

	bindSelectFile () {
		const el = document.querySelectorAll('.attachment-recent-checkbox-requirements')
		el.forEach((val, index) => {
			val.removeEventListener('click', this.enableUploadButton)
			val.addEventListener('click', this.enableUploadButton)
		})
	}

	enableUploadButton(e) {
		const btn = document.getElementById('file-attachment-upload-recent-btn-requirements')
		const id = e.target.getAttribute('data-resources')
		const oFilename = e.target.getAttribute('data-original-filename')

		if(id&&e.target.checked) {
			window.bms.bidding.files.recentFilesToUpload[id] = oFilename
		}else{
			delete window.bms.bidding.files.recentFilesToUpload[id]
		}

		// enable button
		setTimeout(() => {
			Object.keys(window.bms.bidding.files.recentFilesToUpload).length > 0 ? btn.removeAttribute('disabled') : btn.setAttribute('disabled', 'disabled')
		},10)
		
	}

	bindAttach() {
		const btn = document.getElementById('file-attachment-upload-recent-btn-requirements')
		const proto = Object.assign({__proto__: this.__proto__}, this)
		btn.addEventListener('click', this.attach.bind(proto))
	}


	bindSelectDeviceFile () {
		const el = document.querySelector('#file-upload-attachment-requirements')
		const proto = Object.assign({__proto__: this.__proto__}, this)
		el.removeEventListener('change', this.appendFileToBeUploaded.bind(proto))
		el.addEventListener('change', this.appendFileToBeUploaded.bind(proto))
	}

	removeAttachments (e) {

		window.bms.default.spinner.show()
		e.target.setAttribute('disabled', 'disabled')

		let data = {
			id: window.bms.default.modal.resources,
			action: 'remove',
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
				document.getElementById('bidding-modal').close()
				window.bms.default.spinner.hide()
			}
		}).catch((err) => {
			document.querySelector('#bidding-modal > .content > .body').innerHTML = `
					<div class="col text-center">
						<h3 class="text-danger">Failed</h3>
						<p class="text danger">Unable To Remove this Item. Please try again later</p>
					</div>
				`
			document.getElementById('bidding-modal').close()
			window.bms.default.spinner.hide()
		})
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
		document.querySelectorAll('.remove-attachments-modal').forEach((val, index) => {
			val.addEventListener('click',this.loadRemoveAttachments.bind(proto))
		})
	}


}

