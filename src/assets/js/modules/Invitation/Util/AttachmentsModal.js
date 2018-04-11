import AttachmentsDialog from '../../../components/FileDialog/Dialog'
import { Attachments } from './Attachments'



const dial = new AttachmentsDialog({id: 'prop-modal'})
document.querySelectorAll('.file-prop-attachment-dialog-btn').forEach((val, index) => {
	val.addEventListener('click', () => {
		dial.dialog().then(() => {
			// get recent files
			const att = new Attachments()
			// show recent once
			if (!document.querySelector('.recently-attached')) {

				att.bindSelectDeviceFile()
			}
		})
	})
})


