import ApiConfig from '../../config/api'
const DropdownLoader = import('../../utils/dropdown-loader')

export default class {
  constructor (opt) {
    this.opt = opt
    this.__apiConfig = ApiConfig
    //this.bindAttach()
  }

  /*attach () {
    console.log('a')
  }

  bindAttach() {
		const btn = document.querySelector(this.opt.selector)
		const proto = Object.assign({__proto__: this.__proto__}, this)
		btn.addEventListener('click', this.attach.bind(proto))
  }*/


  __appendFileToBeUploaded (e) {
    const targ = document.querySelectorAll('.attachment-pool-section')

		// close dialog
    document.querySelector('.file-attachment-main-dialog').classList.remove('open')
    
    // preview
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
				this.save(e.target.opt.id, e.target.files[i], i)	
			}
    })
    
    // dropdown
    DropdownLoader.then(loader =>  loader.default('device-dropdown'))
  }
  
  __bindSelectDeviceFile (opt) { 
    const el = document.querySelector(opt.selector)
    const __proto = Object.assign({__proto__: this.__proto__}, this)
    el.opt = opt
		el.removeEventListener('change', this.__appendFileToBeUploaded.bind(__proto))
		el.addEventListener('change', this.__appendFileToBeUploaded.bind(__proto))
  }
  
  upload(opt) {
    const __proto = Object.assign({__proto__: this.__proto__}, this)
    this.__bindSelectDeviceFile(opt)
  }

    /**
   * Attachment Components
   */
 loadAttachments (target, data) { 
    import('../attachments-item/').then(res => {
      const targ = document.querySelector(target)
      console.log(targ)
      console.log(data)
      if (!targ) return 0
      // append files
      data.forEach((val ,index) => {
        targ.append(new res.default(val))
      })
    })
  }

  save(id,file,index) { 
    //form data
    const formData = new FormData() 
		formData.append('files', file)
		formData.append('id', id)
		formData.append('token', window.localStorage.getItem('token'))

    //XHR
		let request = new XMLHttpRequest();
		request.open("POST", `${this.__apiConfig.url}/bidding/attachments/`);

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
				const __payload = {
					id: request.responseText,
					type: file.type.split('/')[1],
					original_filename: file.name,
        }
        
				this.loadAttachments('.attachments-info-section', [__payload])
				// more settings
				setTimeout(() => {
					//const pop = new window.bms.exports.PopupES()
				//	window.bms.default.dropdown('device-dropdown')	
					// remove attachments
					//this.bindRemoveAttachments()

				},1000)
					
			}else{
				targ.parentNode.textContent = 'Error uploading'
			}
		})

		request.send(formData);

	}
}