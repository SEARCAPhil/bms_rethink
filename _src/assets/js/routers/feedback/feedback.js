import PopupES from '../../Components/PopupES/PopupES'
import Quill from 'Quill'

const appRoute = new window.bms.exports.Router('http://127.0.0.1/bms_rethink/www/',true)
const loadCSS = (href) => {
	let css = document.createElement('link')
	css.type= 'text/css'
	css.rel = 'stylesheet'
	css.href = href
	document.body.append(css)
}

let PopupInstance = {}
let XHR = new window.bms.exports.XHR()
let quill = ''

window.bms.default.pages = []
window.bms.default.spinner = new window.bms.exports.Spinner({
	target:'body',
	class:'spinner'
})


const loadFeedbackForm = (params) => {
	window.bms.default.changeDisplay(['.inv-router-section', '.bids-router-section', '.bids-router-reports-section', '.welcome-router-section'],'none')
	window.bms.default.changeDisplay(['.feedback-router-section'],'block')
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

const loadQuill = () => {
	quill = new Quill(document.getElementById('editor'), {
		modules: {
		  toolbar: [
			[{ header: [1, 2, false] }],
			['bold', 'italic', 'underline', 'link'],
			['code-block'],
			[{ 'list': 'ordered'}, { 'list': 'bullet' }],
		  ]
		},
		placeholder: 'Compose an epic...',
		theme: 'snow'  // or 'bubble'
	  });
}
//main entry point
appRoute.on({
	'*': () => {

	},
	'/feedback/form':()=>{
		loadFeedbackForm().then(() => {
			// load editor
			loadQuill()
			// submit btn
			const btn = document.querySelector('.add-feedback-button').addEventListener('click', () => {
				const content = quill.root.innerHTML
				const payload = {
					token: window.localStorage.getItem('token'),
					feedback: content,
					action: 'create'
				}
				const quillCount = quill.getText().length > 5
				if (quillCount) {
					window.bms.default.spinner.show()
					
					sendFeedback(payload).then((data) => {

						if (data > 0) {
							// show success
							const sec = document.querySelector('[name="/feedback/form"]')
							sec.innerHTML = `
								<article class="col-12  col-lg-6 offset-lg-4" style="margin-top:150px;overflow:auto;padding-bottom:30px">
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
			loadCSS('https://cdn.quilljs.com/1.3.6/quill.snow.css')

		}).catch(() => {
			alert('Unable to submit feedback. Please try again later.')
			window.bms.default.spinner.hide()
		})
	}
}).resolve()