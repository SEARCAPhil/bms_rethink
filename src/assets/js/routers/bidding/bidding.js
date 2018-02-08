const appRoute = new window.bms.exports.Router('http://127.0.0.1/bms_rethink/www/',true)
const appRouteProd = new window.bms.exports.Router('http://127.0.0.1/bms_rethink/www/',true)
const XHR = new window.bms.exports.XHR()

window.bms.default.pages = []
window.bms.default.spinner = new window.bms.exports.Spinner({
	target:'bids-router-section',
	class:'spinner'
})

const loadBiddingInitialPage = () => {
	let htm = `
		<div class="col-lg-6 offset-lg-2 d-lg-offset-2 text-center" style="margin-top:70px;">
    		<h2>Bidding Management</h2>
		    <small><p class="text-muted">
		    	"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, qui
		    </p></small>
			<img src="assets/img/bid.png" width="150px"><br/><br/>
			<button class="btn btn-dark" onclick="window.location='#/bids/forms/registration'"> REQUEST NEW BIDDING +</button>
		</div>
	`
	document.querySelector('div[name="/bids/initial"]').innerHTML=htm	
	window.bms.default.changeDisplay(['div[name="/bids/initial"]'],'block')
}

const loadSuppliersListSection = () => {
	let htm = `
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
		                <span class="menuList suppliers_new_button"><a href="#/suppliers/forms/registration"><i class="material-icons md-18">add</i></a></span>
		                <br> 
		           	</div>
				</section>	
				<section>
					<!--list-->
					<div class="row list-section"></div>
				</section>	
		    </section>
		</article>
	`

	let targ=document.querySelector('div[name="/bids"]')
	targ.innerHTML = htm
}

const loadRegistration = () => {
	return new Promise((resolve,reject)=>{
		XHR.request({url:'./pages/bidding/forms/registration/registration.html',method:'GET'}).then((data)=>{
			var el=document.querySelector('div[name="/bids/forms/registration/1"]')

			el.innerHTML=data

			setTimeout(()=>{
				window.bms.default.scriptLoader(el)
			},10)

			resolve(data)
		})
	}) 
	
}


const loadRegistrationItem = () => {
	return new Promise((resolve,reject)=>{
		XHR.request({url:'./pages/bidding/forms/registration/products.html',method:'GET'}).then((data)=>{
			var el=document.querySelector('div[name="/bids/forms/registration/2"]')

			el.innerHTML=data

			setTimeout(()=>{
				window.bms.default.scriptLoader(el)
			},10)

			resolve(data)
		})
	}) 
	
}


const loadRegistrationFileAttachment = () => {
	return new Promise((resolve,reject)=>{
		XHR.request({url:'./pages/bidding/forms/registration/attachments.html',method:'GET'}).then((data)=>{
			var el=document.querySelector('div[name="/bids/forms/registration/3"]')

			el.innerHTML=data

			setTimeout(()=>{
				window.bms.default.scriptLoader(el)
			},10)

			resolve(data)
		})
	}) 
	
}



appRoute.on({
 	'/*': () => {
 		// this is required to always treat suppliers as separate route
 		// without this, link will stop working after a few clicks
 	},
	'/bids/all': () => {
		//window.bms.default.spinner.show()
		loadSuppliersListSection()
		loadBiddingInitialPage()
	},
	'/bids/forms/registration':()=>{
		window.bms.default.changeDisplay(['div[name="/bids/forms/registration"]','div[name="/bids/forms/registration/1"]'],'block')
		window.bms.default.changeDisplay(['div[name="/bids/initial"]','div[name="/bids/forms/registration/2"]','div[name="/bids/forms/registration/3"]'],'none')
			
		//toggle list sidebar for medium and small devices
		let lg = window.getComputedStyle(document.querySelector('.hidden-on-lg')).display

		if(lg=='block'){
			window.bms.default.changeDisplay(['div[name="/bids"]'],'none')	
		}

		loadRegistration()

	},
	'/bids/forms/registration/steps/2':()=>{
		window.bms.default.changeDisplay(['div[name="/bids/forms/registration"]','div[name="/bids/forms/registration/2"]'],'block')
		window.bms.default.changeDisplay(['div[name="/bids/initial"]','div[name="/bids/forms/registration/1"]','div[name="/bids/forms/registration/3"]'],'none')
			
		//toggle list sidebar for medium and small devices
		let lg = window.getComputedStyle(document.querySelector('.hidden-on-lg')).display

		if(lg=='block'){
			window.bms.default.changeDisplay(['div[name="/bids"]'],'none')	
		}

		loadRegistrationItem()

	},
	'/bids/forms/registration/steps/3':()=>{
		window.bms.default.changeDisplay(['div[name="/bids/forms/registration"]','div[name="/bids/forms/registration/3"]'],'block')
		window.bms.default.changeDisplay(['div[name="/bids/initial"]','div[name="/bids/forms/registration/1"]','div[name="/bids/forms/registration/2"]'],'none')
			
		//toggle list sidebar for medium and small devices
		let lg = window.getComputedStyle(document.querySelector('.hidden-on-lg')).display

		if(lg=='block'){
			window.bms.default.changeDisplay(['div[name="/bids"]'],'none')	
		}

		loadRegistrationFileAttachment() 

	}
}).resolve()