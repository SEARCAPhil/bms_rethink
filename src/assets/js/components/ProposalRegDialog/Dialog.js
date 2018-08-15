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
		html.classList.add('col', 'col-lg-12', 'prop-reg-main-dialog')
		//unique dialog box
		html.id = `prop-reg-main-dialog-${this.id}`
		html.addEventListener('click', this.close)
		html.innerHTML = `
			<style>
				.prop-reg-main-dialog{
					background: rgba(255,255,255,0.6);
					height: 100vh;
					position: fixed;
					z-index: 2;
					opacity: 0;
					visibility:hidden;
					top:0;
				}
				.prop-reg-main-dialog .body{
					transition:all 0.2s ease-in-out;
					right:-120vh;
					opacity:0;
				}
				.prop-reg-main-dialog.open{
					visibility:visible;
					opacity: 1;
				}
				.prop-reg-main-dialog.open .body{
					right:-10px;
					opacity:1;
				}
			</style>
            <section class="col col-lg-7 float-right body" style="height: 100vh;background: #fff;box-shadow: -30px 0 30px -30px rgba(0,0,0,.2);overflow-y:auto;padding-bottom:120px;" id="reg-prop-dialog-section">
                
            </section>
		`
		


		return new Promise((resolve, reject) => {
			this.el = document.querySelector(`#prop-reg-main-dialog-${this.id}`)
			// if not present in DOM
			if(!this.el) {
				// cancel btn
				//const cancelBtn = html.querySelector(`#file-attachment-main-dialog-cancel-btn-${this.id}`)
				//cancelBtn.addEventListener('click', this.cancel.bind(proto))
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
		if (e.target.classList.contains('prop-reg-main-dialog')) {
			e.target.classList.remove('open')
		}
	}

	cancel () {
		const el = document.querySelector(`#prop-reg-main-dialog-${this.id}`)
		el.classList.remove('open')
	}


}