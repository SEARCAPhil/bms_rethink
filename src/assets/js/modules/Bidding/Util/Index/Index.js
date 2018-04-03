export default class {
	constructor () {}
	loadBiddingInitialPage () {
		let htm = `
			<div class="col-lg-6 offset-lg-2 d-lg-offset-2 text-center" style="margin-top:70px;">
	    		<h2>Bidding Management</h2>
			    <small><p class="text-muted">
			    	"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, qui
			    </p></small>
				<img src="assets/img/bid.png" width="150px"><br/><br/>
				<button class="btn btn-dark" onclick="window.location='#/bids/forms/registration/steps/1'"> REQUEST NEW BIDDING +</button>
			</div>
		`
		document.querySelector('div[name="/bids/initial"]').innerHTML=htm	
		window.bms.default.changeDisplay(['div[name="/bids/initial"]'],'block')
	}


	loadBiddingInfo (data = {}) {
		return new Promise((resolve,reject) => {
			let htm = `
			<section class="row" style="background:#F4F9FD;margin-top:50px;position:relative;">
				<small class="col-12" id="detail-info-menu-status">

				</small>
				<small class="col-lg-11 offset-lg-1" id="detail-info-menu">
					<ul class="nav">
						<li class="nav-item row">
							<a class="nav-link send-bidding-modal-btn"  href="#" data-target="#bidding-modal" data-popup-toggle="open">
							 	<i class="material-icons md-18">send</i> Send 
							</a>
						</li>
						<li class="nav-item file-attachment-dialog-btn">
							<a class="nav-link">
								<i class="material-icons md-18">attach_file</i> Attach
							</a>
						</li>
						<li class="nav-item">
							<a class="nav-link nav-link remove-bidding-modal-btn" href="#" data-target="#bidding-modal" data-popup-toggle="open">
								<i class="material-icons md-18">remove_circle_outline</i> Remove
							</a>
						</li>


						<li class="nav-item">
							<a class="nav-link nav-link" href="#/bids/forms/registration/${data.id}/steps/1/update">
								Update
							</a>
						</li>


						<li class="nav-item">
							<a class="nav-link nav-link remove-bidding-modal-btn" href="${window.bms.config.network}/bidding/reports/bidding_request.php?id=${data.id}" target="_blank">
								<i class="material-icons md-18">print</i> PRINT
							</a>
						</li>

						<!--<li class="nav-item" style="position:relative;">
							<a href="#" class="device-dropdown" data-device-dropdown="dropdown-info-${data.id}" data-resources="${data.id}">
								<i class="material-icons md-18">more_vert</i>
							</a>
							<div class="dropdown-section float-right" id="dropdown-info-${data.id}" style="left:0px;">
								<ul class="list-group list-group-flush">
									<li class="list-group-item"><a class="text-muted">Set status to :</a></li>
									<li class="list-group-item">
										<a href="#" onclick="event.preventDefault()" class="set-bidding-modal-btn" data-target="#bidding-modal" data-popup-toggle="open" data-resources="6">
											<span class="bidding-status-info">
												${data.status == '6' ? '<i class="material-icons text-success md-18">check</i>' : '' }
											</span> Failed
										</a>
									</li>
									<li class="list-group-item">
										<a href="#" onclick="event.preventDefault()" class="set-bidding-modal-btn" data-target="#bidding-modal" data-popup-toggle="open" data-resources="5">
											<span class="bidding-status-info"> 
												${data.status == '5' ? '<i class="material-icons text-success md-18">check</i>' : '' }
											</span> Closed
										</a>
									</li>
									<li class="list-group-item">
										<a href="#" onclick="event.preventDefault()" class="set-bidding-modal-btn" data-target="#bidding-modal" data-popup-toggle="open"  data-resources="2">
											<span class="bidding-status-info">
												${data.status !='5' && data.status !='6' ? '<i class="material-icons text-success md-18">check</i>' : '' }
											</span> Open
										</a>
									</li>
								<ul>
							</div>
						</li>-->

					</ul>
				</small>
			</section>

			<section class="row" style="padding:3px;margin-bottom:40px;" id="detail-info-collaborator">

				<!--collaborators-->
				<!--<div class="col-lg-11 col-sm-12 offset-lg-1 row">
					<span class="text-muted col-lg-1 col-sm-2 col-2 float-left row"> To <i class="material-icons md-18">add_circle_outline</i> </span>
					<span class="col text-muted float-left" style="width:200px;border:1px solid #ccc;background:#f1f1f1ee;" contenteditable="true" id="bidding-collaborator-email"></span>
				</div>-->

				<!--attachments-->
				<div class="col-lg-11 col-sm-12 offset-lg-1 row attachment-pool-section" style="padding-top:10px;"></div>
			</section>
				<section class="col-lg-11 offset-lg-1">
					<small>
						<div>
							<div class="text-center" style="float:left;width: 55px;height: 55px;border-radius:50%;margin-right:10px;overflow:hidden;background: #6c757d;color:#fff;padding-top:5px;font-size: 2em;" id="image-info-section"></div>
							<p>
								<span><b id="bidding-created-by-info"></b></span><br>
								<span class="text-muted" id="bidding-date-created"></span>
							</p><br/>
						</div>
						<hr/>
					</small>
		    		<h3 id="bidding-name"></h3>
		    		<p class="text-muted">
		    			<span id="bidding-description-info"></span>
		    			<span id="bidding-number-info" class="badge badge-sm badge-dark"></span> 
		    		</p>
				    <small>
				    	
						<br/>
						<p class="deadline"><b>Deadline</b> : <span id="bidding-deadline-info">N/A</span></p>
						<p class="bidding-excemption text-danger"><b>For Bidding Excemption</b> : <span id="bidding-excemption-info">N/A</span></p>
						<p>
							<b>Shared to : </b> <span id="bidding-collaborators"></span>
						</p>
				    	<p>
				    		<!--attachments section -->
							<div class="row" id="attacments-info-section" style="padding:5px;"></div>
				    	</p>
				    </small>
				    <hr/>		
				</section>
			`
			document.querySelector('div[name="/bids/info/details"]').innerHTML=htm	
			window.bms.default.changeDisplay(['div[name="/bids/info"]'],'block')
			
			resolve()
		})
		
	}

	loadBiddingParticularsInfo () {
		return new Promise((resolve, reject) => {
			let htm = `
				<section class="col-lg-11 offset-lg-1" style="margin-top:70px;">
		    		<h2>FY 2016/2017 IT Equipment</h2>
				    <small>
				    	<p class="deadline"><b>Deadline</b> : March 5, 2017</p>
					    <p class="text-muted">
					    	"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, qui
					    </p>
				    
				    	<p>
				    		<b>Attachments</b>
							<span class="badge badge-light">VAT-Excempt.pdf</span> 
				    	</p>
				    	

				    	<p>
				    		<b>Recepient</b>
					    	<span class="badge badge-dark">cjbm@searca.org</span>
					    	<span class="badge badge-dark">cjbm@searca.org</span> 
				    	</p>


				    </small>
				    <hr/>		
				</section>
			`
			document.querySelector('div[name="/bids/info/particulars/details"]').innerHTML=htm	
			window.bms.default.changeDisplay(['div[name="/bids/info/particulars"]'],'block')

			resolve()
		})
		
	}

	loadBiddingParticulars (id) {
		return new Promise((resolve, reject) => {
			let htm = `
				<section class="col-lg-11 offset-lg-1" style="margin-top:70px;">
		    		<div class="row col">
		    			<span class="float-left"><b>Particulars</b></span> 
		    			<div class="btn-circle"><a href="#/bids/forms/registration/${id}/steps/2">+</a></div>
		    		</div>
		    		<hr/>
		    		<div id="particulars-section"></div>		
				</section>
			`
			document.querySelector('div[name="/bids/info/requirements"]').innerHTML=htm	
			window.bms.default.changeDisplay(['div[name="/bids/info"]'],'block')

			resolve()
		})
	}

	loadBiddingRequirementsInfo () {
		let htm = `
			<link rel="preload" as="style" href="../node_modules/popup-es/dist/src/css/popup-es.min.css" onload="this.rel='stylesheet'">
			<dialog id="bidding-requirements-modal" data-popup="fade">
				<div class="content">
					<!--close button-->
					<a href="#" data-popup-toggle="close">x</a>
					<div class="header"></div>
					<div class="body" id="modal-bidding-requirements-body"></div>
				</div>	
			</dialog>
			<section class="row" style="background:#F4F9FD;padding:3px;margin-top:50px;margin-bottom:5px;">
					<small class="col-lg-11 offset-lg-1">
						<ul class="nav">
							<li class="nav-item">
								<a href="#" onclick="event.preventDefault()" class="nav-link send-requirements-modal-btn" data-target="#bidding-requirements-modal" data-popup-toggle="open">
								 	<i class="material-icons md-18">insert_invitation</i> Send Invitation
								</a>
							</li>
							<li class="nav-item">
								<a class="nav-link file-attachment-requirement-dialog-btn">
									<i class="material-icons md-18">attach_file</i> Attach
								</a>
							</li>

							<li class="nav-item">
								<a class="nav-link proposal-requirement-dialog-btn">
									<i class="material-icons md-18">receipt</i> Proposals
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
			    	<p>
			    		<b>Amount : </b>
		    			<span class="req-currency">PHP</span>
		    			<b><span class="req-amount text-danger">.00</span></b>
			    		
			    	</p>
			    	<p><b>Quantity : </b> <span class="req-quantity"></span> <span class="req-unit"></span></p>
			    	<p>
			    		<b>Funding(s) : </b><span class="col-12 row" id="funds-requirements-info-section"></span>
			    	</p>

			    	<p>
			    		<b>Attachments</b>
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
		document.querySelector('div[name="/bids/info/particulars/details"]').innerHTML=htm	
		window.bms.default.changeDisplay(['div[name="/bids/info/particulars"]'],'block')
	}

	loadBiddingListSection () {
		const targ=document.querySelector('div[name="/bids"]')
		const oldElem = document.querySelector('.list-bids-container')
		const htm = `
			<link rel="preload" as="style" href="../node_modules/popup-es/dist/src/css/popup-es.min.css" onload="this.rel='stylesheet'">
			<dialog id="bidding-modal" data-popup="fade">
				<div class="content">
					<!--close button-->
					<a href="#" data-popup-toggle="close">x</a>
					<div class="header"></div>
					<div class="body" id="modal-bidding-body"></div>
				</div>	
			</dialog>
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
											<a href="#/bids/all">All</a>
										</span>
									</li>
									<!--<li class="list-group-item">
										<span class="menuList blockedNav"><a href="#/bids/open">Open</a></span>
									</li>

									<li class="list-group-item">
										<span class="menuList blockedNav"><a href="#/bids/closed">Closed</a></span>
									</li>-->

									<li class="list-group-item">
										<span class="menuList blockedNav">
											<i class="material-icons md-18 text-muted">drafts</i>
											<a href="#/bids/drafts">Drafts</a>
										</span>
									</li>
								<ul>
							</ul></ul></div>

			                <span class="menuList suppliers_new_button float-right"><a href="#/bids/forms/registration/steps/1">New <i class="material-icons md-18">add_circle_outline</i></a></span>
			                <br> 
			           	</div>
					</section>	
					<section>
						<!--list-->
						<div class="row list-bidding-section"></div>
					</section>	
			    </section>
			</article>
		`

		if (!oldElem) {
			targ.innerHTML = htm
			window.bms.default.lazyLoad(['./assets/js_native/assets/js/routers/bidding/list.js'],{once:true})
		}
		
	}
}