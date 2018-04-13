export default class {
	constructor (opt = {}) {
		this.class = opt.class
		this.id = opt.id
		this.targ = document.querySelector('body')
		this.XHR = new window.bms.exports.XHR()
	}
	dialog () {
		const proto = Object.assign({ __proto__: this.__proto__ }, this)
		
		let html = document.createElement('section')
		html.classList.add('col', 'col-lg-12', 'file-attachment-main-dialog')
		//unique dialog box
		html.id = `file-attachment-main-dialog-${this.id}`
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
					top:0;
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
                <section class="col col-lg-2 float-right d-flex align-items-stretch body" style="height: 100vh;background: #fff;box-shadow: -30px 0 30px -30px rgba(0,0,0,.2);">
                   
                    <div class="col-12" style="padding-top: 100px;">
                        <div class="col-lg-12" style="height: 70vh;">
                            <p>File Attachment <i class="material-icons">navigate_next</i> <span class="text-muted">Select</span></p>
                            <hr/>
                            <div class="recently-attached-section mt-3" id="recently-attached-section-${this.id}">
                            	<center>
                            			<i class="material-icons md-48">cloud</i>
                            			<h6>Upload files from your device</h6>
	                             		<label for="file-upload-attachment-${this.id}" class="btn btn-dark btn-sm">Select file <i class="material-icons md-18">attach_file</i></label>
	                             		<input id="file-upload-attachment-${this.id}" name="file-upload-attachment[]" class="hide" type="file" multiple/>
	                             </center>
	                             	  
                            </div> 
                        </div>
                       
                    </div>
                </section>
		`
		

		return new Promise((resolve, reject) => {
			this.el = document.querySelector(`#file-attachment-main-dialog-${this.id}`)
			// if not present in DOM
			if(!this.el) {
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
		const el = document.querySelector(`#file-attachment-main-dialog-${this.id}`)
		el.classList.remove('open')
	}


}