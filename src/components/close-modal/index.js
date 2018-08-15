import style from './style'
const template = `
<section class="remove-modal-section">
  <style>${style.toString()}</style>
	<center>
		<i class="material-icons md-48" style="font-size:6em;">lock</i>
		<h3>Close</h3>
		<p>You will not be able to update the content of this item. Are you sure you want to continue?</p>

		<button class="btn btn-danger" id="modal-dialog-send-button">YES</button> 
		<button class="btn btn-secondary" id="modal-dialog-close-button">NO</button>
	</center>
</section>`

export { template }