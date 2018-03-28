import AttachmentsService from '../../Services/Requirements'
import AttachmentsDialog from '../../../../components/FileDialog/Dialog'
import ReqUtilities from '../Requirements'
import { AttachmentsReq } from './Requirements'


const dial= new AttachmentsDialog({id:'requirements'})
document.querySelectorAll('.file-attachment-requirement-dialog-btn').forEach((val, index) => {

	const el = val.cloneNode(true)

	el.addEventListener('click', () => {
		dial.dialog().then(() => {
			// get recent files
			const att = new AttachmentsReq()
			// show recent once
			if (!document.querySelector('.recently-attached-requirements')) {
				att.recent({ token: window.localStorage.getItem('token')})
				att.bindAttach()
				att.bindSelectDeviceFile()
			}
		})
	})

	val.replaceWith(el)
})


