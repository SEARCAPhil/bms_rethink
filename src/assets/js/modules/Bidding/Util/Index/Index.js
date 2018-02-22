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


	loadBiddingInfo (id) {
		return new Promise((resolve,reject) => {
			let htm = `
			<section class="row" style="background:#F4F9FD;padding:3px;margin-top:50px;">
				<small class="col-lg-11 offset-lg-1" id="detail-info-menu">
					<ul class="nav">
						<li class="nav-item">
							<a class="nav-link send-bidding-modal-btn"  href="#" data-target="#bidding-modal" data-popup-toggle="open">
							 	<i class="material-icons md-18">send</i> Send 
							</a>
						</li>
						<li class="nav-item">
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
							<a class="nav-link nav-link" href="#/bids/forms/registration/${id}/steps/1/update">
								Update
							</a>
						</li>

					</ul>
				</small>
			</section>
			<section class="row" style="padding:3px;margin-bottom:40px;" id="detail-info-collaborator">
				<div class="col-lg-11 col-sm-12 offset-lg-1 row">
					<span class="text-muted col-lg-1 col-sm-2 col-2 float-left"> To <i class="material-icons md-18">add_circle_outline</i> </span>
					<span class="col text-muted float-left" style="width:200px;border:1px solid #ccc;background:#f1f1f1ee;" contenteditable="true" id="bidding-collaborator-email"></span>
				</div>
			</section>
				<section class="col-lg-11 offset-lg-1">
		    		<h2 id="bidding-name"></h2>
		    		<p class="text-muted">
		    			<span id="bidding-description-info"></span>
		    			<span id="bidding-number-info" class="badge badge-sm badge-dark"></span> 
		    		</p>
				    <small>
				    	
				    	<div>
							<div style="float: left;width: 25px;height: 25px;border-radius: 50%;background: #ccc;margin-right: 10px;overflow: hidden;">
								<img src="assets/img/user.png" width="100%">
							</div>
							<small>
								<span><b>Van Alen S. Limbaco</b></span><br>
								<span class="text-muted" id="bidding-date-created"></span>
							</small>
						</div>
						<br/>
						<p class="deadline"><b>Deadline</b> : <span id="bidding-deadline-info">N/A</span></p>
						<p id="bidding-collaborators"></p>
				    	<!--<p>
				    		<b>Attachments</b>
							<span class="badge badge-dark">VAT-Excempt.pdf</span> 
				    	</p>-->
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
			let htm = `<link rel="preload" as="style" href="../node_modules/popup-es/dist/src/css/popup-es.min.css" onload="this.rel='stylesheet'">
						<dialog id="bidding-modal" data-popup="fade">
							<div class="content">
								<!--close button-->
								<a href="#" data-popup-toggle="close">x</a>
								<div class="header"></div>
								<div class="body" id="modal-bidding-body"></div>
							</div>	
						</dialog>
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
			<section class="row" style="background:#F4F9FD;padding:3px;margin-top:50px;margin-bottom:40px;">
					<small class="col-lg-11 offset-lg-1">
						<ul class="nav">
							<li class="nav-item">
								<a class="nav-link disabled">
								 	<i class="material-icons md-18">send</i> Send 
								</a>
							</li>
							<li class="nav-item">
								<a class="nav-link disabled">
									<i class="material-icons md-18">attach_file</i> Attach
								</a>
							</li>
						</ul>
					</small>
			</section>
			<section class="col-lg-11 offset-lg-1">
	    		<h2 class="req-name"></h2>
			    <small>
			    	<p>
			    		<b>Amount : </b>
		    			<span class="req-currency">PHP</span>
		    			<b><span class="req-amount text-danger">.00</span></b>
			    		
			    	</p>
			    	<p><b>Quantity : </b> <span class="req-quantity"></span> <span class="req-unit"></span></p>

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
			<article class="row list-bids-container">
				<!--list-->
			    <section class="col-md-12 col-lg-12 float-left list-sidebar" style="background:#fff;box-shadow:0 0 5px rgba(200,200,200,.7);min-height: 100vh">     
					<section style="margin-top:55px;">
						<div class="row">
							<span class="search-list-section-icon"><i class="material-icons">search</i></span>
							<span class="search-list-section hide"><input class="form-control" type="text" style="padding:4px;border:none;background:#fcfcfc;" placeholder="Search"></span>
						</div>
					</section>
					<section>
						<div class="col col-md-12" data-role="none" style="margin-bottom: 5px;">
			                <span class="menuList allNav"><a href="#/bids/all">All</a></span>&emsp;
			                <span class="menuList blockedNav"><a href="#/bids/open">Open</a></span>&emsp;
			                <span class="menuList blockedNav"><a href="#/bids/closed">Closed</a></span>&emsp;
			                 <span class="menuList blockedNav"><a href="#/bids/drafts">Drafts</a></span>&emsp;
			                <span class="menuList suppliers_new_button"><a href="#/bids/forms/registration/steps/1">New <i class="material-icons md-18">add_circle_outline</i></a></span>
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