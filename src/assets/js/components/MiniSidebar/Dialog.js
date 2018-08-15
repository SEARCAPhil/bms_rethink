export default class {
	constructor (opt = {}) {
		this.class = opt.class
		this.id = opt.id
		this.targ = document.querySelector('body')
		this.XHR = new window.bms.exports.XHR()
	}
	dialog () {
		const proto = Object.assign({ __proto__: this.__proto__ }, this)
		const givenName = window.localStorage.getItem('givenName')
		let username = window.localStorage.getItem('username')

		// empty value if the same with givenName
		if (username === givenName) {
			username = ''
		}

		let html = document.createElement('section')
		html.classList.add('col', 'col-lg-2', 'account-sidebar', 'col-md-3')
		//unique dialog box
		html.id = `account-sidebar-${this.id}`
		html.addEventListener('click', this.close)
		html.innerHTML = `
			<style>
				.account-sidebar{
					height: 100vh;
					position: fixed;
					z-index: 2;
					opacity: 0;
					visibility:hidden;
					top:0;
					right:0;
				}
				.account-sidebar .body{
					transition:all 0.2s ease-in-out;
					right:-120vh;
					opacity:0;
				}
				.account-sidebar.open{
					visibility:visible;
					opacity: 1;
				}
				.account-sidebar.open .body{
					right:0;
					opacity:1;
				}
			</style>
                <section class="row col-12 float-right d-flex align-items-stretch body" style="height: 100vh;background: #eee;">
                   
                    <div class="col-12" style="padding-top: 100px;">
                        <div style="height: 70vh;">
                            <h4>My Accounts <span class="float-right close-account-sidebar"><small>x</small></span></h4><br/><br/>
       
                            <div class="mt-3">
                            		<div class="media">
									  <div class="text-center" style="float:left;width:55px;height:55px;border-radius:50%;overflow:hidden;background:#495057;color:#fff;padding-top:5px;font-size:1.5em;" id="image-header-section">${givenName.substr(0,2).toUpperCase()}</div>
									  <div class="media-body ml-1">
									    <span class="mt-0">${givenName}</span><br/>
									    <small>${username || 'N/A'}</small><br/><br/>

									    <small>
									    	<p>
									    		<a href="#/feedback/form">Send feedback</a><br/>
									    		<a href="#/logout">Sign out</a></p>
									    </small>
									  </div>
									</div>
	                             	  
                            </div> 
                        </div>
                       
                    </div>
                </section>
		`
		

		return new Promise((resolve, reject) => {
			this.el = document.querySelector(`#account-sidebar-${this.id}`)
			// if not present in DOM
			if(!this.el) {
				this.targ.append(html)

				setTimeout(() => {
					html.classList.add('open')
					document.querySelector('.close-account-sidebar').addEventListener('click', () => {
						html.classList.remove('open')
					})

				},50)
			}else{
				this.el.classList.add('open')
			}

			resolve(html)
		})	
	}

	close (e) {
		if (e.target.classList.contains('account-sidebar')) {
			e.target.classList.remove('open')
		}
	}

	cancel () {
		const el = document.querySelector(`#account-sidebar-${this.id}`)
		el.classList.remove('open')
	}


}