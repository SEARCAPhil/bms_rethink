import AttachmentsService from '../Services/Attachments'
import AttachmentsDialog from '../../../components/FileDialog/Dialog'
import InfoUtilities from './Info'
import { Attachments } from './Attachments'


const dial= new AttachmentsDialog({id: 'bidding'})
document.querySelectorAll('.file-attachment-dialog-btn').forEach((val, index) => {
	val.addEventListener('click', () => {
		dial.dialog().then(() => {
			// get recent files
			const att = new Attachments()
			// show recent once
			if (!document.querySelector('.recently-attached')) {
				att.recent()
				att.bindAttach()
				att.bindSelectDeviceFile()
			}
		})
	})
})


