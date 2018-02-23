import ListService from '../Services/List/List'
import IndexedDB from '../Util/Storage/Bidding'

export default class {
	constructor () {
		this.XHR = new window.bms.exports.XHR()
		this.ListServ = new ListService()
		this.IDB = new IndexedDB()
	}

	removeRequirements (e) {
		window.bms.default.spinner.show()
		let data = {
			id: e.target.el.id,
			action: 'remove',
		}

		this.ListServ.removeRequirements(data).then((json) => {
			let res = JSON.parse(json)

			if(res.data){
				e.target.el.parentNode.parentNode.parentNode.parentNode.remove()
				document.getElementById('bidding-modal').close()
			}

			window.bms.default.spinner.hide()
			
		})
	}

	loadRemoveRequirements (e) {
		const URL='pages/suppliers/modal/remove.html'
		const id=e.target.id
		const proto = Object.assign({ __proto__: this.__proto__ }, this)

		return this.XHR.request({method:'GET',url:URL}).then(res=>{
			let modalTarget=document.getElementById('modal-bidding-body')
			modalTarget.innerHTML=res

			setTimeout(()=>{
				window.bms.default.scriptLoader(modalTarget)
			},50)

			setTimeout(()=>{
				//remove cancel
				document.getElementById('modal-dialog-close-button').addEventListener('click',()=>{
		
					document.getElementById('bidding-modal').close()
					
				})

				let btn = document.getElementById('modal-dialog-remove-button')
				btn.el =  e.target
				btn.addEventListener('click', this.removeRequirements.bind(proto))
			})
		}).catch(e=>{})
	}


	bindRemoveRequirements () {
		const proto = Object.assign({ __proto__: this.__proto__ }, this)
		document.querySelectorAll('.remove-requirements-modal-btn').forEach((val, index) => {
			val.addEventListener('click',this.loadRemoveRequirements.bind(proto))
		})
	}


}