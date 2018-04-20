import { AttachmentsReq } from '../../modules/Bidding/Util/Attachments/Requirements'
import IndexUtilities from '../../modules/Bidding/Util/Index/Index'
import InfoUtilities from '../../modules/Bidding/Util/Info'
import IndexedDB from '../../modules/Bidding/Util/Storage/Bidding'
import IndexedDBReq from '../../modules/Bidding/Util/Storage/Requirements'
import PopupES from '../../Components/PopupES/PopupES'
import ProposalService from '../../modules/Invitation/Services/Proposal'
import RequirementsUtilities from '../../modules/Bidding/Util/Requirements'



const appRoute = new window.bms.exports.Router('http://127.0.0.1/bms_rethink/www/',true)
const IDB = new IndexedDB()
const IDBReq = new IndexedDBReq()
const IndexUtil = new IndexUtilities()
const InfoUtil = new InfoUtilities()
const AttUtil = new AttachmentsReq()
const PropServ = new ProposalService ()
const ReqUtil = new RequirementsUtilities()

window.bms.default.pages = []
window.bms.default.spinner = new window.bms.exports.Spinner({
	target:'body',
	class:'spinner'
})

let PopupInstance = {}
let XHR = new window.bms.exports.XHR()


const loadCSS = (href) => {
	let css = document.createElement('link')
	css.type= 'text/css'
	css.rel = 'stylesheet'
	css.href = href
	document.body.append(css)
}



const loadFeedbackForm = (params) => {
	return new Promise((resolve, reject) => {
		const URL='pages/feedback/forms/registration.html'

		return XHR.request({method:'GET',url:URL}).then(res=>{
			let modalTarget=document.querySelector('[name="/feedback/form"]')
			modalTarget.innerHTML=res

			setTimeout(()=>{
				window.bms.default.scriptLoader(modalTarget)
			},100)
			resolve()

		}).catch(e=>{
			reject(e)
		})
	})
}

const sendFeedback = (payload) => {
	return new Promise((resolve, reject) => {

		var url=`${window.bms.config.network}/feedback/`

		return XHR.request({method:'POST',url:url, body: JSON.stringify(payload)}).then(res=>{
			resolve(res)
		}).catch(e=>{
			reject(e)
		})
	})
}

//main entry point
appRoute.on({
	'*': () => {

	},
	'/feedback/form':()=>{
		loadFeedbackForm().then(() => {

			const btn = document.querySelector('.add-feedback-button').addEventListener('click', () => {
				const textarea = document.getElementById('feedback-textarea')
				const payload = {
					token: window.localStorage.getItem('token'),
					feedback: textarea.value,
					action: 'create'
				}

				if (textarea.value.length > 5) {
					window.bms.default.spinner.show()

					sendFeedback(payload).then((data) => {

						if (data > 0) {
							// show success
							const sec = document.querySelector('[name="/feedback/form"]')
							sec.innerHTML = `
								<article class="col-xs-12 col-md-12 col-lg-10 offset-lg-1 col-xs-12" style="margin-top:150px;overflow:auto;padding-bottom:30px">
									<div class="alert alert-success text-center">
										<i class="material-icons md-18">tag_faces</i> Thank you for sharing your experience with us. Your feedback matters!
									</div>
								</article>
							`
						}

						window.bms.default.spinner.hide()
					})
				}
			})
		}).catch(() => {
			alert('Unable to submit feedback. Please try again later.')
			window.bms.default.spinner.hide()
		})
	}
}).resolve()