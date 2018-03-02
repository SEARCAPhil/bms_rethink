import AttachmentsService from '../../Services/Requirements'
import AttachmentsDialog from '../../../../components/FileDialog/Dialog'
import ReqUtilities from '../Requirements'



export class AttachmentsReq{
	constructor () {
		this.AttServ = new AttachmentsService()
		this.ReqUtil = new ReqUtilities()
		this.target = document.querySelector('#recently-attached-section-requirements')

	}

	recent () {
		this.AttServ.recent().then(json => {
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

		this.AttServ.attach({attachments:window.bms.bidding.files.recentFilesToUpload, action: 'create'}).then(json => {
			const data = JSON.parse(json)

			//show in DOM
			if (data.data) {

				for (var i = 0; i < data.data.length; i++) {

					const d = {
						type: data.data[i].type,
						original_filename: data.data[i].original_filename,
					}
					this.ReqUtil.appendAttachments(d)
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

		let request = new XMLHttpRequest();


		request.open("POST", "http://127.0.0.1/bms_api/src/api/bidding/requirements/attachments/");

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
					type: file.type.split('/')[1],
					original_filename: file.name,
				}
				this.ReqUtil.appendAttachments(d)
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
}

const dial= new AttachmentsDialog({id:'requirements'})
document.querySelectorAll('.file-attachment-requirement-dialog-btn').forEach((val, index) => {

	const el = val.cloneNode(true)



	el.addEventListener('click', () => {
		dial.dialog().then(() => {
			// get recent files
			const att = new AttachmentsReq()
			// show recent once
			if (!document.querySelector('.recently-attached-requirements')) {
				att.recent()
				att.bindAttach()
				att.bindSelectDeviceFile()
			}
		})
	})

	val.replaceWith(el)
})


