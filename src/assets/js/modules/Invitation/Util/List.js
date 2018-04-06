import ListService from '../Services/List'
import ListTemplate from '../Templates/List'

const DB = new window.bms.exports.IndexedDB()

export default class {
	constructor () {
		this.List = new ListTemplate()
		this.ListServ = new ListService()
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

	lists (opt = {}) {
		this.ListServ.lists(opt).then(data => {
			const json=JSON.parse(data)
			const targ = document.querySelector('.list-inv-section')

			setTimeout(() => {
				// open DB
				// let trans = DB.open('bidding')

				// clear area
				targ.innerHTML = ' '
				for (let x = 0; x < json.length; x++) {
					// str to int
					json[x].id = parseInt(json[x].id)
					json[x].status = parseInt(json[x].status)
					// add to DB
					// trans.add(json[x])
					// add to DOM
					targ.appendChild(this.List.render({id:json[x].bidding_requirements_id, name:json[x].name, deadline:json[x].deadline, unit: json[x].unit, quantity: json[x].quantity, class:`col-xs-12 col-md-12 col-sm-12 list`}))
				}

				window.bms.default.spinner.hide()

				opt.page = opt.page || 1

				if (json.length < 1 && opt.page ===1) {
					this.showEmpty (targ)	
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

	}
	
}