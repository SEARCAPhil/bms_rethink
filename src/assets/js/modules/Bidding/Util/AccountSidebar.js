import AttachmentsDialog from '../../../components/MiniSidebar/Dialog'


const dial= new AttachmentsDialog({id: 'account-sidebar'})
document.querySelectorAll('.account-sidebar-btn').forEach((val, index) => {
	val.addEventListener('click', () => {
		dial.dialog().then(() => {
			
		})
	})
})


