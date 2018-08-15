import style from './style'

const template = `
  <section class="send-req-modal-section">
    <style>${style.toString()}</style>
		<center style="background: #007bff;color: #fff;padding: 10px;margin-bottom: 10px;">
			<h2>Winner</h2>
			<img src="./assets/img/trophy.png" width="100px">
			<p>This proposal will be tagged as the official winner for this bidding.</p>
		</center>

		<section class="col-12">
			<div class="col-12">
				<b>Remarks </b><br/>
				<textarea class="form-control" id="award-remarks" placeholder="Write short statement here(optional)"></textarea>
			</div>
			<br/><br/>
		</section>
		<center  style="padding: 20px;">
			<p class="text-default">Are you sure you want to continue?</p>
			<button class="btn btn-danger" id="modal-dialog-send-button">YES</button> 
			<button class="btn btn-secondary" id="modal-dialog-close-button">NO</button>
		</center>
	</section>`

export { template }