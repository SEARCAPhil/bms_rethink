import ListService from '../Services/List'
import ListTemplate from '../Templates/List'


export default class {
	constructor () {
		this.List = new ListTemplate()
		this.ListServ = new ListService()
	}

	loadInitialPage () {
		let htm = `
			<div class="col-lg-6 offset-lg-2 d-lg-offset-2 text-center" style="margin-top:70px;">
				<img src="assets/img/invitation.png" width="90%" style="min-width:300px;"/>
	    		<h2>Invitations</h2>
			    <small>
				    <p>
				    	Select an invitation from the list and send an awesome proposals
				    </p>
				</small>
				
				
			</div>
		`
		document.querySelector('div[name="/inv/initial"]').innerHTML=htm	
		window.bms.default.changeDisplay(['div[name="/inv/initial"]'],'block')
	}

	loadListSec () {
		// new XHR instance to avoid conflict
		const XHR = new window.bms.exports.XHR()
		return new Promise((resolve,reject)=>{
			XHR.request({url:'./pages/bidding/invitation/list.html',method:'GET'}).then((data)=>{
				const targ = document.querySelector('div[name="/inv"]')
				// avoid readding to DOM if already exists
				  targ.innerHTML = data  

				resolve(data)
			}).catch(err => {
				console.log(err)
			})
		}) 
	}

	loadInfo (obj = {}) {
		// new XHR instance to avoid conflict
		const XHR = new window.bms.exports.XHR()
		return new Promise((resolve,reject)=>{
			XHR.request({url:'./pages/bidding/invitation/info.html',method:'GET'}).then((data)=>{
				const targ = document.querySelector('div[name="/inv/info/details"]')	
				window.bms.default.changeDisplay(['div[name="/inv/info"]'],'block')
				targ.innerHTML = data  
				resolve(data)
			}).catch(err => {
				console.log(err)
			})
		}) 
	}

	
	showEmpty (targ) {
		targ.innerHTML = `
			<center class="col text-muted empty-list-message-section" style="margin-top:50px;">
				<i class="material-icons md-48" >mail_outline</i>
				<h5>Empty List</h5>
				<p>
			        <small>You dont have any invitation</small>
			    </p>
									
			</center>
		`
	}

	showEmptySearch () {
		const targ = document.querySelector('.list-search-inv-section')
		targ.innerHTML = `
			<center class="col text-muted empty-list-message-section" style="margin-top:50px;">
				<i class="material-icons md-48">search</i>
				<p>
			        <small>No matches found. <br/>Please try another keyword</small>
			    </p>
									
			</center>
		`
	}


	search (e) {
		const targ = document.querySelector('.list-search-inv-section')

		let opt = {
			token : window.localStorage.getItem('token'),
			param: e.target.value,
			page: 1, 
		}

		if (e.target.value.length > 0) {

			// hide list and show search results
			document.querySelector('.list-inv-section').classList.add('hide')
			targ.classList.remove('hide')

			// clear area
			if (opt.page === 1) targ.innerHTML = ' <div class="col text-muted text-center">searching . . . </div>'

			// search
			clearTimeout(this.timeout)
			this.timeout = setTimeout(() => {
				// search
				this.ListServ.search(opt).then(data => {
					const json = JSON.parse(data)
					// clear area
					targ.innerHTML = ' '
					for (let x = 0; x < json.length; x++) {
						// str to int
						json[x].id = parseInt(json[x].id)
						json[x].status = parseInt(json[x].status)

						targ.appendChild(this.List.render({id: json[x].id, bidding_requirements_id: json[x].bidding_requirements_id, name:json[x].name, deadline:json[x].deadline, unit: json[x].unit, quantity: json[x].quantity, class:`col-xs-12 col-md-12 col-sm-12 list`}))
					}

					// empty result
					if (opt.page === 1 && json.length === 0) {
						this.showEmptySearch()		
					} 


				}).catch(err => {
					this.showEmptySearch()	
				})

			},500)

		} else {
			// revert to normal
			document.querySelector('.list-inv-section').classList.remove('hide')
			document.querySelector('.list-search-inv-section').classList.add('hide')
		}

	}

	// load more invitations from database
	loadMoreInvitations (e) {
		// get new page
		let page = e.target.page		
		page ++
		// remove more button
		event.target.parentNode.remove()
		// retrieve from DB
		this.lists({
			token : window.localStorage.getItem('token'),
			page,
		})
	}

	lists (opt = {}) {
		const proto = Object.assign({ __proto__: this.__proto__ }, this)
		opt. page = opt.page || 1
		// retrieve from DB
		this.ListServ.lists(opt).then(data => {
			const json=JSON.parse(data)
			const targ = document.querySelector('.list-inv-section')

			setTimeout(() => {
				// open DB
				// let trans = DB.open('bidding')
				// clear area for the very first request
				if (opt.page == 1) {
					targ.innerHTML = ' '
				}

				for (let x = 0; x < json.length; x++) {
					// str to int
					json[x].id = parseInt(json[x].id)
					json[x].status = parseInt(json[x].status)

					// add to DOM
					targ.appendChild(this.List.render({id: json[x].id, bidding_requirements_id: json[x].bidding_requirements_id, name:json[x].name, deadline:json[x].deadline, unit: json[x].unit, quantity: json[x].quantity, class:`col-xs-12 col-md-12 col-sm-12 list`}))
					// show more button if contains data
					// this will be triggered at the end of the loop
					if (x+1 == json.length) {
						const p = document.createElement('p')
						const moreBtn = document.createElement('a')
						moreBtn.textContent = 'show more'
						moreBtn.href = '#'
						moreBtn.page = opt.page
						moreBtn.setAttribute('onclick','event.preventDefault();')
						moreBtn.addEventListener('click', this.loadMoreInvitations.bind(proto))
						p.classList.add('text-center', 'col-12')
						p.appendChild(moreBtn)
						targ.appendChild(p)
					}
				}

				window.bms.default.spinner.hide()

			

				if (json.length < 1 && opt.page ===1) {
					this.showEmpty (targ)	
				}

				// allow searching
				const searchBtn = document.querySelector('#search')
				if (searchBtn) {
					this.timeout = 0
					const proto = Object.assign({ __proto__: this.__proto__ }, this)
					searchBtn.addEventListener('keyup', this.search.bind(proto))
				}

				
			},100)

		}).catch(err => {
			// show empty status
			const targ = document.querySelector('.list-bidding-section')
			opt.page = opt.page || 1
			if (opt.page ===1 && targ) {
				this.showEmpty (targ)
			}
			window.bms.default.spinner.hide()
		})
	}


	/*listsFromLocal (opt = {}) {

		const targ = document.querySelector('.list-bidding-section')
		let filter = 0
		opt.filter=opt.filter||'all'

		setTimeout(() => {
			
			// open DB
			let trans = DB.open('bidding')

			const myIndex = trans.index('status'); 

			// get data  based from filter
			switch(opt.filter) {
				case 'all':
					filter = 1
				break
				case 'drafts':
					filter = 0
				break
				default :
					filter = 0
				break
			}


			let keys = myIndex.getAllKeys(filter)


			targ.innerHTML = ''
			myIndex.openCursor(IDBKeyRange.bound(filter,filter ? 10 : filter)).onsuccess = (event) => {
				const cursor = (event.target.result)
				if(cursor) {
					//add to DOM
					targ.appendChild(this.List.render({id:cursor.value.id,name:cursor.value.name,description:cursor.value.description,class:'col-xs-12 col-md-12 col-sm-12 list'}))
					cursor.continue()
				}
			}

			
		},90)

	}*/
	
}