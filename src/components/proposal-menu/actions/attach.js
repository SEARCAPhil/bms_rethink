import ApiConfig from '../../../config/api'

const BiddingServ = import('../../../services/bidding-proposal-service')
const DropdownLoader = import('../../../utils/dropdown-loader')

export default class {
  constructor(opt) {
    this.__apiConfig = ApiConfig
    this.opt = opt
    // hackish way to prevent the same ID
    // spread operator failed so use Object
    this.opt2 = Object.assign({}, opt)
    this.opt2.id = '1-1'
    this.bind()
  }

  success() {	
    // close popup
    document.getElementById('general-modal').close()
    window.location.reload()
  }

  error (err = '') {
    alert('Unable to remove this bidding request! Please try again later')
    // close popup
    document.getElementById('general-modal').close()
    console.log(err)
  }

  __appendFileToBeUploaded (e) {
    const targ = document.querySelectorAll(`#attachment-prop-pool-section-${this.opt.id}`)

		// close dialog
		document.querySelector(`#file-attachment-main-dialog-${this.opt2.id}`).close()
    
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
				this.save(this.opt.id, e.target.files[i], i)	
			}
    })
    
    // dropdown
    import('../../../utils/dropdown-loader').then(loader =>  loader.default('device-dropdown'))
  }

  __bindSelectDeviceFile (opt) { 
    const el = document.querySelector(opt.selector)
    const __proto = Object.assign({__proto__: this.__proto__}, this)
    el.opt = opt
    el.classList.add('event-binded')
		el.addEventListener('change', this.__appendFileToBeUploaded.bind(__proto))
  }

  /**
   * Attachment Components
   */
  loadAttachments (target, data) { 
    import('../../proposal-attachments-item').then(res => {
      const targ = document.querySelector(target)
      if (!targ) return 0
      // append files
      data.forEach((val ,index) => { 
        // class
        val.class = "col-lg-12 col-12"
        targ.append(new res.default(val))
      })
    })
  }

  save(id, file, index) { 
    //form data
    const formData = new FormData() 
		formData.append('files', file)
		formData.append('id', id)
		formData.append('token', window.localStorage.getItem('token'))

    //XHR
		let request = new XMLHttpRequest();
		request.open("POST", `${this.__apiConfig.url}/bidding/invitations/attachments/`);

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
        
				this.loadAttachments(`#recently-attached-prop-section-${id}`, [__payload])
				// more settings
				setTimeout(() => {
          // dropdown and popup menu
          DropdownLoader.then(loader =>  new loader.default('device-dropdown'))
          import('../../../components/popup-es').then(loader => new loader.default())
          
				},1000)
					
			}else{
				targ.parentNode.textContent = 'Error uploading'
			}
		})

		request.send(formData);

  }
  
  async load () {
    const dialog = (await import('../../dialog-pane')).default

    return new dialog(this.opt2).then(res => {
      // open dialog pane
      res.open()
      this.render()

      // attach to DOM
      const sec = document.querySelector(`#${res.id} > .body`)
      sec.classList.add('col-lg-2')
      sec.classList.remove('col-lg-6')
      sec.innerHTML = ''
      sec.parentNode.style.zIndex = 21
      sec.append(this.template)

      setTimeout(() => {
        this.__bindSelectDeviceFile({
          selector: '#file-upload-attachment-prop-modal:not(.event-binded)',
        })

      },1000)

    })
  }

  render () {
    this.template = document.createElement('section')
    this.template.id = "file-attachment-main-dialog-prop-modal"
    this.template.classList.add('row')

   
    // template
    this.template.innerHTML = `
      <div class="col-12" style="padding-top: 100px;">
        <div class="col-lg-12" style="height: 70vh;">
            <p>File Attachment <i class="material-icons">navigate_next</i> <span class="text-muted">Select</span></p>
            <hr>
            <div class="recently-attached-section mt-3" id="recently-attached-section-prop-modal">
              <center>
                  <i class="material-icons md-48">cloud</i>
                  <h6>Upload files from your device</h6>
                  <label for="file-upload-attachment-prop-modal" class="btn btn-dark btn-sm">Select file <i class="material-icons md-18">attach_file</i></label>
                  <input id="file-upload-attachment-prop-modal" name="file-upload-attachment[]" class="hide" type="file" multiple="">
              </center>  
            </div> 
        </div>
    </div>`
  }

  bind () {
    const proto = Object.assign({ __proto__: this.__proto__ }, this)
    const root = this.opt.root || document
    const sel =  root.querySelectorAll(`${this.opt.selector}:not(.event-binded)`)
    sel.forEach((el, index) => {
      el.classList.add('event-binded')
      el.addEventListener('click', this.load.bind(proto))
    })
  }
  
}