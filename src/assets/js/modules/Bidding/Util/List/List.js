import ListService from '../../Services/List/List'
import ListTemplate from '../../Templates/List/List'

const XHR = new window.bms.exports.XHR()

export default class {
	constructor () {
		this.List = new ListTemplate()
		this.ListServ = new ListService()
	}

	view (id) {
		return this.ListServ.view({id: id, token : window.localStorage.getItem('token')})
	}
	changeStatus (data) {
		return this.ListServ.status(data)
	}

	showEmpty (targ) {
		targ.innerHTML = `
			<center class="col text-muted empty-list-message-section" style="margin-top:50px;">
				<i class="material-icons md-48" >mail_outline</i>
				<h5>Empty List</h5>
				<p>
			        <small>Your list empty.Start adding a new one!</small>
			    </p>
									
			</center>
		`
	}

	showEmptySearch () {
		const targ = document.querySelector('.list-search-bidding-section')
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
		const targ = document.querySelector('.list-search-bidding-section')

		let opt = {
			token : window.localStorage.getItem('token'),
			param: e.target.value,
			page: 1, 
		}

		if (e.target.value.length > 0) {

			// hide list and show search results
			document.querySelector('.list-bidding-section').classList.add('hide')
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

						targ.appendChild(this.List.render({id:json[x].id, name:json[x].name, description:json[x].description, profile_name:json[x].profile_name, date_created:json[x].date_created, class:`col-xs-12 col-md-12 col-sm-12 list ${window.bms.default.state.bidding.cur.bid.id==json[x].id ? 'active' : ''}`}))
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
			document.querySelector('.list-bidding-section').classList.remove('hide')
			document.querySelector('.list-search-bidding-section').classList.add('hide')
		}

	}

	// load more bidding from database
	loadMoreBiddingRequests (e) {
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
			const targ = document.querySelector('.list-bidding-section')

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
					// add to DB
					// trans.add(json[x])
					// add to DOM
					targ.appendChild(this.List.render({id:json[x].id, name:json[x].name, description:json[x].description, profile_name:json[x].profile_name, date_created:json[x].date_created, class:`col-xs-12 col-md-12 col-sm-12 list ${window.bms.default.state.bidding.cur.bid.id==json[x].id ? 'active' : ''}`}))
					if (x+1 == json.length) {
						const p = document.createElement('p')
						const moreBtn = document.createElement('a')
						moreBtn.textContent = 'show more'
						moreBtn.href = '#'
						moreBtn.page = opt.page
						moreBtn.setAttribute('onclick','event.preventDefault();')
						moreBtn.addEventListener('click', this.loadMoreBiddingRequests.bind(proto))
						p.classList.add('text-center', 'col-12')
						p.appendChild(moreBtn)
						targ.appendChild(p)
					}
				}

				window.bms.default.spinner.hide()

				opt.page = opt.page || 1

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


	listsFromLocal (opt = {}) {

		const targ = document.querySelector('.list-bidding-section')
		let filter = 0
		opt.filter=opt.filter||'all'

		setTimeout(() => {
			
			// open DB
			/*let trans = DB.open('bidding')

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
			}*/

			
		},90)

	}

	loadBiddingInitialPage () {
		let htm = `
			<div class="col-lg-7 offset-lg-2 d-lg-offset-2 text-center" style="margin-top:70px;">
				<div style="float:left;width:100%;height:200px;background:url('assets/img/laptop.png') no-repeat center;background-size:contain;"></div>
				<br/><br/>
				<h2>Bidding Management System</h2>
				<small><p class="text-muted">
					Compare supplier's price easier , faster and better than before! Be the first to use the new and advanced bidding management system 
				</p></small>
				<button class="btn btn-dark" onclick="window.location='#/bids/forms/registration/steps/1'"> GETTING STARTED</button>
			</div>
		`
		document.querySelector('div[name="/bids/initial"]').innerHTML = htm	
		window.bms.default.changeDisplay(['div[name="/bids/initial"]'], 'block')
	}
	
	loadListSec () {
		// new XHR instance to avoid conflict
		const XHR = new window.bms.exports.XHR()
		return new Promise((resolve,reject)=>{
			XHR.request({url:'./pages/bidding/list.html',method:'GET'}).then((data)=>{
				const targ = document.querySelector('div[name="/bids"]')
				const oldElem = document.querySelector('.list-bids-container')
				// avoid readding to DOM if already exists
				//if (!oldElem) {
				  targ.innerHTML = data  
				 // window.bms.default.lazyLoad(['./assets/js_native/assets/js/routers/bidding/list.js'])
				//}
				resolve(data)
			}).catch(err => {
				console.log(err)
			})
		}) 
	}

	loadBiddingParticulars (id) {
		return new Promise((resolve, reject) => {
			let htm = `
				<section class="col-lg-11 offset-lg-1" style="margin-top:70px;">
		    		<div class="row col">
		    			<span class="float-left"><b>Particulars</b></span> 
		    			<div class="btn-circle for-open"><a href="#/bids/forms/registration/${id}/steps/2">+</a></div>
		    		</div>
		    		<hr/>
		    		<div id="particulars-section"></div>		
				</section>

				<!--feedback-->
				<small>
					<article class="col-lg-11 offset-lg-1 feedback-bidding-list-section" id="${id}"></article><br/><br/>
				</small>
			`
			document.querySelector('div[name="/bids/info/requirements"]').innerHTML=htm	
			window.bms.default.changeDisplay(['div[name="/bids/info"]'],'block')

			resolve()
		})
	}

	loadBiddingRequirementsInfo () {
		return new Promise((resolve,reject)=>{
			XHR.request({url:'./pages/bidding/requirements.html',method:'GET'}).then((data)=>{
				document.querySelector('div[name="/bids/info/particulars/details"]').innerHTML = data	
				window.bms.default.changeDisplay(['div[name="/bids/info/particulars"]'], 'block')
				resolve(data)
			}).catch(err => {
				console.log(err)
			})
		}) 
	}

	
}