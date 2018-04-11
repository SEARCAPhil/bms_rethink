export default class {
	constructor () {}
	loadInitialPage () {
		let htm = `
			<div class="col-lg-6 offset-lg-2 d-lg-offset-2 text-center text-muted" style="margin-top:70px;">
				<i class="material-icons" style="font-size:6em;">mail</i>
	    		<h2>Invitations</h2>
			    <small>
				    <p class="text-muted">
				    	"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, qui
				    </p>
				</small>
				
				
			</div>
		`
		document.querySelector('div[name="/inv/initial"]').innerHTML=htm	
		window.bms.default.changeDisplay(['div[name="/inv/initial"]'],'block')
	}
	

	loadListSection () {
		const targ=document.querySelector('div[name="/inv"]')
		const oldElem = document.querySelector('.list-inv-container')
		const htm = `

			<article class="row list-bids-container">
				<!--list-->
			    <section class="col-md-12 col-lg-12 float-left list-sidebar" style="background:#fff;box-shadow:0 0 5px rgba(200,200,200,.7);min-height: 100vh">     
					<section style="margin-top:55px;">
						<!--<div class="row">
							<span class="search-list-section-icon"><i class="material-icons">search</i></span>
							<span class="search-list-section hide"><input class="form-control" type="text" style="padding:4px;border:none;background:#fcfcfc;" placeholder="Search"></span>
						</div>-->
					</section>
					<section>
						<div class="col col-md-12" data-role="none" style="margin-bottom: 5px;border-bottom:1px solid rgba(240,240,240,0.4);">
							<a href="#" class="device-dropdown" data-device-dropdown="list-menu-drop" onclick="event.preventDefault();">
								Filter <i class="material-icons md-18">expand_more</i>
							</a>

							<div class="dropdown-section float-right" id="list-menu-drop" style="left:0px;">
								<ul class="list-group list-group-flush">
									<li class="list-group-item">
										<span class="menuList allNav">
											<i class="material-icons md-18 text-muted">inbox</i>
											<a href="#/inv/all">All</a>
										</span>
									</li>


									<li class="list-group-item">
										<span class="menuList blockedNav">
											<i class="material-icons md-18 text-muted">drafts</i>
											<a href="#/inv/closed">Closed</a>
										</span>
									</li>
								<ul>
							</ul></ul></div>

			                
			                <br> 
			           	</div>
					</section>	
					<section>
						<!--list-->
						<div class="row list-inv-section"></div>
					</section>	
			    </section>
			</article>
		`

		if (!oldElem) {
			targ.innerHTML = htm
			window.bms.default.lazyLoad(['./assets/js_native/assets/js/routers/invitations/list.js'],{once:true})
		}
		
	}

	loadInfo (data = {}) {
		return new Promise((resolve,reject) => {
			let htm = `
				<link rel="preload" as="style" href="./assets/css/popup-es.css" onload="this.rel='stylesheet'">
				<dialog id="bidding-requirements-modal" data-popup="fade">
					<div class="content">
						<!--close button-->
						<a href="#" data-popup-toggle="close">x</a>
						<div class="header"></div>
						<div class="body" id="modal-bidding-requirements-body"></div>
					</div>	
				</dialog>
				<section class="row" style="background:#F4F9FD;margin-top:50px;margin-bottom:5px;">

					<small class="col-12" id="detail-req-menu-status">
						
					</small>

					<small class="col-lg-11 offset-lg-1">
						<ul class="nav">
							<li class="nav-item">
								<a href="#" onclick="event.preventDefault()" class="nav-link send-requirements-modal-btn hide" data-target="#bidding-requirements-modal" data-popup-toggle="open">
								 	<i class="material-icons md-18">insert_invitation</i> Send Invitation
								</a>
							</li>
							<li class="nav-item">
								<a class="nav-link text-muted">
									Hooray! You are invited to bid on this product. Please review the details before sending a proposal
								</a>
							</li>


							<li class="nav-item text-muted">
								<a class="nav-link proposal-requirement-dialog-btn">
									<i class="material-icons md-18">message</i>
								</a>
							</li>

						</ul>
					</small>
				</section>

				<section class="row" style="padding:3px;margin-bottom:40px;" id="detail-info-collaborator">
					<!--recepients-->
					<div class="col-lg-11 col-sm-12 offset-lg-1 row attachment-recepients-section" style="padding-top:10px;"></div>

					<!--attachments-->
					<div class="col-lg-11 col-sm-12 offset-lg-1 row attachment-requirements-pool-section"></div>

				</section>

				<section class="col-lg-10 offset-lg-1">
		    		<h2 class="req-name"></h2>
				    <small>
				    	<p><b>Reference #: </b> <span class="req-reference-number">Not Set</span></p>
				    	<p class="text-danger"><b>Quantity : </b> <span class="req-quantity"></span> <span class="req-unit"></span></p>

				    	<p><b>Deadline: </b> <span class="req-deadline">Not Set</span></p>


				    	<p>
				    		<!--attachments section -->
							<div class="row" id="attachments-requirements-info-section" style="padding:5px;"></div>
				    	</p>


				    </small>
				    <hr/>	
				    <h5>
				    	<span class="header-circle"><i class="material-icons md-24">add_shopping_cart</i></span>
				    	Specification
				    </h5><br/>	
				    <div class="specs-section-info d-flex row"></div>
				</section>
				`
				document.querySelector('div[name="/inv/info/details"]').innerHTML=htm	
				window.bms.default.changeDisplay(['div[name="/inv/info"]'],'block')
				
				resolve()
			})
			
	}

}