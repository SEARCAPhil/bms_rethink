const appRoute = new window.bms.exports.Router('http://127.0.0.1/bms_rethink/www/',true)
const XHR = new window.bms.exports.XHR()

export default class {
	constructor () {}

	loadBiddingParticularsProducts () {
		let htm = `
			<section class="col-lg-11 offset-lg-1" style="margin-top:70px;">
	    		<p><b>Products/Services</b></p>
			    <small>
			    	<details>
			    		<summary class="text-info">
			    			HP Pro One800 AIO
			    			<span class="float-right text-danger">20 Units</span>

			    		</summary>
			    		<div class="col-lg-12">
			    			<small>
				    			<p><b>CPU :</b> Corei7 Gen 3</p>
				    			<p><b>RAM :</b> 32GB DDR3</p>
				    		</small>
			    		</div>
			    	</details>
			    	<div class="col-lg-12">
				    	<p class="deadline"><b>Deadline</b> : March 5, 2017</p>
				    	<p>
				    		<b>Recepient</b> : 
				    		<span class="badge badge-dark">juan@amti.com</span>
				    		<span class="badge badge-dark">juan@amti.com</span>
				    		<span class="badge badge-dark">juan@amti.com</span>
				    	</p>
				    	<p>
				    		<b>Budget</b> : <span class="text-danger">PHP 2,300,000</span>
				    	</p>
				    </div>
			    </small>
			    <hr/>		
			</section>
		`
		document.querySelector('div[name="/bids/info/particulars/products"]').innerHTML=htm	
		window.bms.default.changeDisplay(['div[name="/bids/info/particulars"]'],'block')
	}


	loadRegistration () {
		return new Promise((resolve,reject)=>{
			const url = './pages/bidding/forms/registration/registration.html'

			window.bms.loadedScript = window.bms.loadedScript || []

			/*if (window.bms.loadedScript.indexOf(url) != -1 ) {
				resolve()
				return 0
			}*/

			

			XHR.request({url:url,method:'GET'}).then((data)=>{
				window.bms.loadedScript.push(url)

				var el=document.querySelector('div[name="/bids/forms/registration/1"]')

				el.innerHTML=data

				setTimeout(()=>{
					window.bms.default.scriptLoader(el)
					resolve(data)
				},100)

				
			})
		}) 
		
	}


	loadRegistrationItem () {
		return new Promise((resolve,reject)=>{
			XHR.request({url:'./pages/bidding/forms/registration/products.html',method:'GET'}).then((data)=>{
				var el=document.querySelector('div[name="/bids/forms/registration/3"]')

				el.innerHTML=data

				setTimeout(()=>{
					window.bms.default.scriptLoader(el)
				},10)

				resolve(data)
			})
		}) 
		
	}


	loadRegistrationItemSuccess () {
		return new Promise((resolve,reject)=>{
			XHR.request({url:'./pages/bidding/forms/registration/success.html',method:'GET'}).then((data)=>{
				var el=document.querySelector('div[name="/bids/forms/registration/3"]')

				el.innerHTML=data

				setTimeout(()=>{
					window.bms.default.scriptLoader(el)
				},10)

				resolve(data)
			})
		}) 
		
	}


	loadRegistrationParticulars () {
		return new Promise((resolve,reject)=>{
			XHR.request({url:'./pages/bidding/forms/registration/particulars.html',method:'GET'}).then((data)=>{
				var el=document.querySelector('div[name="/bids/forms/registration/2"]')

				el.innerHTML=data

				setTimeout(()=>{
					window.bms.default.scriptLoader(el)
				},10)

				resolve(data)
			})
		}) 
		
	}


	loadRegistrationFileAttachment () {
		return new Promise((resolve,reject)=>{
			XHR.request({url:'./pages/bidding/forms/registration/attachments.html',method:'GET'}).then((data)=>{
				var el=document.querySelector('div[name="/bids/forms/registration/4"]')

				el.innerHTML=data

				setTimeout(()=>{
					window.bms.default.scriptLoader(el)
				},10)

				resolve(data)
			})
		}) 
		
	}

}
