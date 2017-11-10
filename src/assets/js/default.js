(()=>{
	//sideBar
	let sideBar=false
	const sideBarInit=()=>{
		let sideBar=new window.bms.exports.Sidebar('.docker-menu ','#docker-sidebar')
		sideBar.toggle()
	}

	window.bms.default.availableOffline=()=>{
		var el=document.querySelector('.online-status.offline')
		el.style.display="block"
		el.innerHTML=`
			<div class="col offline-available-section">
				<div class="row alert alert-info" role="alert">
				  <div class="col-lg-4 offset-lg-5 text-info text-center">You can now use the system offline! &emsp;<a href="#" class="text-primary">DISMISS</a></div>
				</div>	
    		</div>`
    	setTimeout(()=>{
    		el.style.display="none"
    	},15000)
	}

	window.bms.default.activateMenu=(name)=>{
		document.querySelectorAll('.main-menu-list-item').forEach((el,index)=>{
			el.classList.remove('active')
			if(el.getAttribute('data-status')==name) el.classList.add('active')
		})
	}

	window.bms.default.scriptLoader=(scope)=>{
		console.log(scope)
		scope.querySelectorAll(`script`).forEach((sc,index)=>{
			let el=document.createElement('script')
			el.src=sc.getAttribute('src')
			sc.replaceWith(el)
		})

		scope.querySelectorAll(`link`).forEach((sc,index)=>{
			let el=document.createElement('link')
			el.href=sc.getAttribute('href')
			el.type="text/css"
			el.rel="stylesheet"
			sc.replaceWith(el)
		})
		
	}

	if(!sideBar) sideBarInit()

		
})()