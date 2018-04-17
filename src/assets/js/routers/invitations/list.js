import ListUtilities from '../../modules/Invitation/Util/List'
import ListService from '../../modules/Invitation/Services/List'

import PopupES from '../../Components/PopupES/PopupES.js'

const appRoute = new window.bms.exports.Router('http://127.0.0.1/bms_rethink/www/',true)

const XHR = new window.bms.exports.XHR()
let DB = new window.bms.exports.IndexedDB()


const listUtil = new ListUtilities()
const ListServ = new ListService()



let PopupInstance = {}

const viewInvInfo = (id) => {
	/*ListServ.view({id: id, token : window.localStorage.getItem('token')}).then(data => {

		window.bms.default.spinner.hide()

		const parsedData=JSON.parse(data)
		const json=parsedData.data
		json[0].id = parseInt(json[0].id)
		json[0].status = parseInt(json[0].status)

		var e = new CustomEvent('invInfoChange', {detail: json})
		document.dispatchEvent(e)
		
	})	*/
}


const changeInvInfo = () => {

}


// hide menu dropdown
const hideListFilter = () => {
	document.getElementById('list-menu-drop').classList.remove('open')
}

appRoute.on({
	'*': () => {

	},
	'/inv/all': () => {

		window.bms.default.spinner.show()
		listUtil.lists({token : window.localStorage.getItem('token')})
		hideListFilter()
	},
	'/inv/closed': () => {
		
		window.bms.default.spinner.show()
		listUtil.lists({filter: 'closed', token : window.localStorage.getItem('token')})
		hideListFilter()
	},
	'/inv/:id/info': (params) => {
		window.bms.default.spinner.show()
		

		document.removeEventListener('invInfoChange', changeInvInfo)
		document.addEventListener('invInfoChange', changeInvInfo)

		viewInvInfo(params.id)

		// more settings
		/*setTimeout(() => {
			window.bms.default.dropdown('device-dropdown')	
			window.bms.default.lazyLoad(['./assets/js_native/assets/js/modules/Bidding/Util/AttachmentsModal.js'])
		},800)*/


		// show list onpageloaded
		if (!document.querySelector('.list')) {
			//listUtil.listsFromLocal({filter: 'all'})
			listUtil.lists({ token : window.localStorage.getItem('token') })
		}


	}
}).resolve()