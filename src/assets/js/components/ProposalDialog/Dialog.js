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
		html.classList.add('col', 'col-lg-12', 'inv-list-main-dialog')
		//unique dialog box
		html.id = `inv-list-main-dialog-${this.id}`
		html.addEventListener('click', this.close)
		html.innerHTML = `
			<style>
				.inv-list-main-dialog{
					background: rgba(255,255,255,0.6);
					height: 100vh;
					position: fixed;
					z-index: 2;
					opacity: 0;
					visibility:hidden;
					top:0;
				}
				.inv-list-main-dialog .body{
					transition:all 0.2s ease-in-out;
					right:-120vh;
					opacity:0;
				}
				.inv-list-main-dialog.open{
					visibility:visible;
					opacity: 1;
				}
				.inv-list-main-dialog.open .body{
					right:-10px;
					opacity:1;
				}
			</style>
                <section class="col col-lg-7 float-right d-flex align-items-stretch body" style="height: 100vh;background: #fff;box-shadow: -30px 0 30px -30px rgba(0,0,0,.2);">
                    <div class="col row" style="border-right: 1px solid rgba(200,200,200,0.5);padding-top: 100px;">
                        <ul class="list-unstyled col">
                            <li data-role="none">
                                <h5 class="text-center">
                                  <i class="material-icons md-48 text-muted">computer</i>
                                </h5>
                                <p class="text-center">
	                                <h2 id="prop-info-name">Product name</h2>

	                                <small>
					    				<p class="text-danger"><b>Quantity : </b> <span class="prop-info-quantity">0</span> <span class="prop-info-unit">N/A</span></p>
					    			</small>
					    		</p>
                                <hr/>
                             </li>
                             
                             <li>
                             	<li class="nav-item col-12" style="border-bottom:1px solid #ccc;padding-top:5px;padding-bottom:5px">

                             			<div class="col-12">
                             				<div class="text-center" style="float:left;width:35px;height:35px;border-radius:50%;margin-left:30%;overflow:hidden;background:#42403c;color:#fff;padding-top:5px" id="prop-info-name-header-section">N/A</div>
                             			</div>
                         				<div class="col-12 text-center">
                         					<small><p class="prop-info-username">admin@amti.com<br><span class="text-muted prop-info-date-created">N/A</span></p></small>
                         				</div>
                             	</li>
                             	
                             </li>
                        </ul>
                    </div>
                    <div class="col-9" style="padding-top: 60px;">
                        <div class="col-lg-12" style="height: 70vh;">
                            <p>Your Proposal <i class="material-icons">navigate_next</i> <span class="text-muted">Preview</span>
                            	<span id="file-attachment-main-dialog-cancel-btn-${this.id}" class="float-right text-muted"><u>close (x)</u></span>
                            </p>
       						
                            <!-- menu-->
                            <small class="col-12" id="prop-info-menu-status"></small>

                            <small class="hide" id="prop-info-menu">
								<ul class="nav">
									<li class="nav-item row">
										<a class="nav-link send-prop-modal-btn" href="#" data-target="#bidding-modal" data-popup-toggle="open" data-resources="${window.bms.default.state.proposals.cur.id}"><i class="material-icons md-18">send</i> Send </a>
									</li>
									<li class="nav-item file-attachment-dialog-btn">
										<a class="nav-link">
											<i class="material-icons md-18">attach_file</i> Attach
										</a>
									</li>
									<li class="nav-item">
										<a class="nav-link nav-link remove-prop-modal-btn" href="#" data-target="#bidding-modal" data-popup-toggle="open" data-resources="${window.bms.default.state.proposals.cur.id}">
											<i class="material-icons md-18">remove_circle_outline</i> Remove
										</a>
									</li>


									<li class="nav-item">
										<a class="nav-link nav-link" href="#/bids/forms/registration/32/steps/1/update">
											Update
										</a>
									</li>

								</ul>
							</small>
							<hr/>
                            <div class="recently-attached-section" id="recently-attached-section-${this.id}">
                            	<br/>
                                <section class="col-12">
									<h2 class="text-danger"><span id="prop-info-currency">N/A</span>: <span id="prop-info-amount">00.00</span></h2
									<small>
										<p><b>DISCOUNT : <span id="prop-info-discount">N/A</span></b></p>
									</small>
									<hr/>
								    <h5>
								    	<span class="header-circle"><i class="material-icons md-24">add_shopping_cart</i></span>
								    	Specification
								    </h5><br>	
									<div class="prop-specs-section-info d-flex row">
										
									</div>
								</section>
								<br/><br/>
								<section class="col-12">
									<p><b>Remarks</b></p><br/>
									<p  id="prop-info-remarks" class="text-muted">N/A</p>	
								</section>

                            </div> 
                        </div>



                    </div>
                </section>
		`
		

		return new Promise((resolve, reject) => {
			this.el = document.querySelector(`#inv-list-main-dialog-${this.id}`)
			// if not present in DOM
			if(!this.el) {
				// cancel btn
				const cancelBtn = html.querySelector(`#file-attachment-main-dialog-cancel-btn-${this.id}`)
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
		if (e.target.classList.contains('inv-list-main-dialog')) {
			e.target.classList.remove('open')
		}
	}

	cancel () {
		const el = document.querySelector(`#inv-list-main-dialog-${this.id}`)
		el.classList.remove('open')
	}


}