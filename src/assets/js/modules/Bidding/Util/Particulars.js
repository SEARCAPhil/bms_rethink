import ListService from '../Services/List/List'

export default class {
	constructor () {
		this.XHR = new window.bms.exports.XHR()
		this.ListServ = new ListService()
	}

	removeParticulars (e) {
		let data = {
			id: e.target.el.id,
			action: 'remove',
			token: window.localStorage.getItem('token'),
		}

		this.ListServ.removeParticulars(data).then((json) => {
			let res = JSON.parse(json)
			if(res.data){
				e.target.el.parentNode.parentNode.parentNode.parentNode.remove()
				document.getElementById('bidding-modal').close()
			}
		})
	}

	loadRemoveParticulars (e) {
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
				btn.addEventListener('click', this.removeParticulars.bind(proto))
			})
		}).catch(e=>{})
	}

	bindRemoveParticulars () {
		const proto = Object.assign({ __proto__: this.__proto__ }, this)
		document.querySelectorAll('.remove-particulars-modal').forEach((val, index) => {
			val.addEventListener('click',this.loadRemoveParticulars.bind(proto))
		})
	}

}