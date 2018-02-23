import AttachmentsService from '../Services/Attachments.js'

export default class AttachmentDialog{
	constructor () {
		this.targ = document.querySelector('.bids-router-section')
		this.XHR = new window.bms.exports.XHR()
		this.AttServ = new AttachmentsService()
	}
	dialog () {
		const proto = Object.assign({ __proto__: this.__proto__ }, this)
		
		let html = document.createElement('section')
		html.classList.add('col', 'col-lg-12', 'file-attachment-main-dialog')
		html.addEventListener('click', this.close)
		html.innerHTML = `
			<style>
				.file-attachment-main-dialog{
					background: rgba(255,255,255,0.6);
					height: 100vh;
					position: fixed;
					z-index: 2;
					opacity: 0;
					visibility:hidden;
				}
				.file-attachment-main-dialog .body{
					transition:all 0.2s ease-in-out;
					right:-120vh;
					opacity:0;
				}
				.file-attachment-main-dialog.open{
					visibility:visible;
					opacity: 1;
				}
				.file-attachment-main-dialog.open .body{
					right:0;
					opacity:1;
				}
			</style>
                <div class="col col-lg-6 float-right d-flex align-items-stretch body" style="height: 100vh;background: #fff;box-shadow: -30px 0 30px -30px rgba(0,0,0,.2);">
                    <div class="col row" style="border-right: 1px solid rgba(200,200,200,0.5);padding-top: 100px;">
                        <ul class="list-unstyled col">
                            <li data-role="none">
                                <h5>
                                  <i class="material-icons md-36">computer</i> Device  
                                </h5>
                                <hr/>
                             </li>
                             <li><small>Recent Attachments</small></li>
                             <li><small>Upload <i class="material-icons md-18">attach_file</i></small></li>
                        </ul>
                    </div>
                    <div class="col-9" style="padding-top: 100px;">
                        <div class="col-lg-12" style="height: 70vh;">
                            <p>Recently attached <i class="material-icons">navigate_next</i> <span class="text-muted">Files</span></p><br/>
                            <hr/>
                            <div>
                                <input type="checkbox"> <a href="#">Bidding Request.pdf</a> <small class="text-muted"> (1MB&emsp;Dec 25, 2017)</small>
                            </div> 
                        </div>
                        <div class="col-lg-12">
                            <button class="btn btn-sm btn-default" disabled="disabled">Attach</button> 
                            <button class="btn btn-sm btn-default" id="file-attachment-main-dialog-cancel-btn">CANCEL</button>
                        </div>
                    </div>
                </div>
		`
		

		return new Promise((resolve, reject) => {
			this.el = document.querySelector('.file-attachment-main-dialog')
			// if not present in DOM
			if(!this.el) {
				// cancel btn
				const cancelBtn = html.querySelector('#file-attachment-main-dialog-cancel-btn')
				cancelBtn.addEventListener('click', this.cancel.bind(proto))
				this.targ.append(html)

				setTimeout(() => {
					html.classList.add('open')
				},50)
			}else{
				this.el.classList.add('open')
			}

			resolve(html)
		})	
	}

	close (e) {
		if (e.target.classList.contains('file-attachment-main-dialog')) {
			e.target.classList.remove('open')
		}
	}

	cancel () {
		const el = document.querySelector('.file-attachment-main-dialog')
		el.classList.remove('open')
	}


}

const dial= new AttachmentDialog()
document.querySelectorAll('.file-attachment-dialog-btn').forEach((val, index) => {
	val.addEventListener('click', () => {
		dial.dialog()
	})
})

// get recent
this.AttServ.recent()


