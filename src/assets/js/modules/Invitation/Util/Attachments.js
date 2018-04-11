
export class Attachments{
	constructor () {
		this.target = document.querySelector('#recently-attached-section-bidding')
		this.XHR = new window.bms.exports.XHR()

	}



	appendFileToBeUploaded (e) {
		const targ = document.querySelectorAll('.attachment-prop-pool-section')

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

	upload(file,index) {
		const formData = new FormData() 
		formData.append('files', file)
		formData.append('id', window.bms.default.state.bidding.cur.bid.id)
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
				this.InfoUtil.appendAttachments(d)
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




	bindSelectDeviceFile () {
		const el = document.querySelector('#file-upload-attachment-prop-modal')
		const proto = Object.assign({__proto__: this.__proto__}, this)


		el.removeEventListener('change', this.appendFileToBeUploaded.bind(proto))
		el.addEventListener('change', this.appendFileToBeUploaded.bind(proto))
	}


}
