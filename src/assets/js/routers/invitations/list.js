import ListUtilities from '../../modules/Invitation/Util/List'
import ListService from '../../modules/Invitation/Services/List'
import ProposalService from '../../modules/Invitation/Services/Proposal'

import PopupES from '../../Components/PopupES/PopupES.js'

const appRoute = new window.bms.exports.Router('http://127.0.0.1/bms_rethink/www/',true)

const XHR = new window.bms.exports.XHR()
let DB = new window.bms.exports.IndexedDB()


const listUtil = new ListUtilities()
const ListServ = new ListService()
const PropServ = new ProposalService ()


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

const showWon = () => {
	let targ = document.getElementById('detail-req-menu-status')
	targ.parentNode.style.background = '#007bff'
	targ.parentNode.style.color = '#fff'
	targ.parentNode.innerHTML = `
	<style>
		.congrats-banner {
   			display: block;
			position:relative;
			z-index:0;
		}
		.congrats-banner:after {
			content: '';
			position: absolute;
			top: 0;
			right: 0;
			bottom:0;
			left: 0;
			background:url('assets/img/confetti.png') repeat center;
			z-index:-1;
			opacity:0.7;
		}
	</style>
	<section class="col-lg-12 text-center congrats-banner" style="padding:  20px;">
    					<p><img src="assets/img/medal.png" width="50px"/> Congratulations! You have won on this bidding</p>
					</section>`
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

		PropServ.lists({id: params.id, token : window.localStorage.getItem('token'), id:params.id}).then((data) => {
			const json = JSON.parse(data)
			let targ = document.querySelectorAll('.proposal-list-section > ul')

			targ.forEach((el, index) => {
				// clear proposal list section
				el.innerHTML =''
			})

			json.forEach((val, index) => {
				let html = document.createElement('li')
				let status = ''
				html.classList.add('nav-item', 'col-12')
				html.setAttribute('data-resources', val.id)
				html.style = 'border-bottom:1px solid #ccc;padding-top:5px;padding-bottom: 5px;'
				html.id = val.id

				

				if (val.status == 0) {
					status = `<br/><span class="text-danger" data-resources="${val.id}"><i class="material-icons md-12">drafts</i> DRAFT</span>`
				}

				if (val.status == 1) {
					status = `<br/><span class="text-success" data-resources="${val.id}"><i class="material-icons md-12">check</i> Sent</span>`
				}


				if (val.status == 2) {
					status = `<br/><span class="text-danger" data-resources="${val.id}"><i class="material-icons md-12">warning</i> Requesting changes</span>`
				}

				if (val.status ==3) {
					status = `<br/><span data-resources="${val.id}" style="color:#ffb80c;"><i class="material-icons">star</i> AWARDED</span>`
					// show won status
					showWon()
					// add medal icon
					//const img = document.createElement('img')
					//img.src = 'assets/img/trophy.png'
					//img.style.width = '30px'
					//document.querySelector('.req-name').append(img)
				}

				html.innerHTML = `
                                    <a href="#" class="proposal-dialog-btn row" data-resources="${val.id}">
                                        <div class="col-3"  data-resources="${val.id}">
                                            <div class="text-center" data-resources="${val.id}" style="float:left;width:35px;height:35px;border-radius:50%;margin-right:10px;overflow:hidden;background:#42403c;color:#fff;padding-top:5px" id="image-header-section"  data-resources="${val.id}">${val.username.substr(0,2).toUpperCase()}</div>
                                        </div>
                                        <div class="col-7"  data-resources="${val.id}">
                                                <small data-resources="${val.id}">
                                                    <p data-resources="${val.id}">
                                                        ${val.username}<br/>
                                                        <span class="text-muted">${val.date_created}</span>
                                                        ${status}
                                                    </p>
                                                </small>
                                        </div>
                                    </a>
                           `
                // insert to DOM
                targ.forEach((el, index) => {
                	el.append(html)
                })
			})

			window.bms.default.lazyLoad(['./assets/js_native/assets/js/modules/Invitation/Util/ProposalModal.js'])
			window.bms.default.lazyLoad(['./assets/js_native/assets/js/modules/Invitation/Util/ProposalRegModal.js'])
		})
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