import ApiConfig from '../../config/api'
const DropdownLoader = import('../../utils/dropdown-loader')

export default class {
  constructor (opt) {
    this.opt = opt
    this.__apiConfig = ApiConfig
    this.filesToBeUploaded = {}
   
  }

  __showError () {
    alert('Unable to process this request.Please try again later.')
  }

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

  __bindSelectFile () { 
    const el = document.querySelectorAll('.attachment-recent-checkbox-bidding')
    const __proto = Object.assign({__proto__: this.__proto__}, this)
    
    for(let x of el) {
      x.removeEventListener('change', this.__enableUploadButton.bind(__proto))
      x.addEventListener('change', this.__enableUploadButton.bind(__proto))
    }
  }
  
  __enableUploadButton(e) {
		const btn = document.getElementById(`file-attachment-upload-recent-btn-${this.opt.id}`)
		const id = e.target.getAttribute('data-resources')
		const oFilename = e.target.getAttribute('data-original-filename')

		if(id&&e.target.checked) {
			this.filesToBeUploaded[id] = oFilename
		}else{
			delete this.filesToBeUploaded[id]
		}

		// enable button
		setTimeout(() => {
      Object.keys(this.filesToBeUploaded ).length > 0 ? btn.removeAttribute('disabled') : btn.setAttribute('disabled', 'disabled')
		},10)
		
  }
  

	__showRecent (json) {
    this.filesToBeUploaded = {}
    
		const html = document.createElement('div')
		html.classList.add('recently-attached')
		html.innerHTML = `<input type="checkbox" class="attachment-recent-checkbox-bidding" data-resources="${json.id}" data-original-filename="${json.original_filename}"> 
							<div class="file-icon file-icon-sm" data-type="${json.type}"></div> 
							<a href="#">${json.original_filename}</a> 
							<small class="text-muted"> (${json.size}KB&emsp;${json.date_created})</small>`
		document.querySelector(`#recently-attached-section-${this.opt.id}`).append(html)
		
  }
  
  __bindAttach() {
		const btn = document.getElementById(`file-attachment-upload-recent-btn-${this.opt.id}`)
		const proto = Object.assign({__proto__: this.__proto__}, this)
		btn.addEventListener('click', this.attach.bind(proto))
	}
  

  async recent (opt) {
    const __serv = (await import('../../services/bidding-attachment-service')).default
    this.opt = this.opt || opt
    // get from storage
    return new __serv().recent(opt).then(data => {
      data.data.forEach((val, index) => {
        this.__showRecent(val)
      })
    }).then(() => {
      setTimeout(() => {
        this.__bindSelectFile()
        this. __bindAttach()
      }, 800);
    })
	}

  async attach (e) {
    // disable button first
    e.target.setAttribute('disabled', 'disabled')

    //payload
    const __payload = {
      attachments: this.filesToBeUploaded, 
      action: 'create', 
      id: this.opt.id, 
      token: window.localStorage.getItem('token')
    }
    

    const service = (await import('../../services/bidding-attachment-service')).default
    return new service().attach(__payload).then(data => {
      if (!data.data) return this._showError()
      //show in DOM
      for (var i = 0; i < data.data.length; i++) {
        const __d = {
          type: data.data[i].type,
          original_filename: data.data[i].original_filename,
          id: data.data[i].id,
          menus: ['remove']
        }
        this.loadAttachments('.attachments-info-section', [__d])
      }
				// close dialog
        document.querySelectorAll('.file-attachment-main-dialog').forEach((val, res) => val.close())
      
      setTimeout(() => {
        // dropdown
        DropdownLoader.then(loader =>  loader.default('device-dropdown'))
        e.target.removeAttribute('disabled')
      },1000)
    }).catch(err => {
      this._showError()
    })
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
          menus: ['remove']
        }
        
				this.loadAttachments('.attachments-info-section', [__payload])
				// more settings
				setTimeout(() => {
          // dropdown and popup menu
          DropdownLoader.then(loader =>  new loader.default('device-dropdown'))
          import('../../components/popup-es').then(loader => new loader('device-dropdown'))
          
				},1000)
					
			}else{
				targ.parentNode.textContent = 'Error uploading'
			}
		})

		request.send(formData);

	}
}