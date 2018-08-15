import style from './style'

const template = `
  <section class="send-req-modal-section">
    <style>${style.toString()}</style>
    <center style="background: #007bff;color: #fff;padding: 10px;margin-bottom: 10px;">
		<h2>Winner</h2>
		<img src="./assets/img/trophy.png" width="100px">
		<p>Tag the selected supplier(s) as winning bidder(s)</p>
	</center>

	<section class="col-12">

		<input type="text" class="form-control" placeholder="Search" id="search-supplier">

		<div class="suppliers-invitation-sending-list-section  d-flex flex-wrap"></div>
		
		<div class="col-12"><br/>
			<b>Suppliers</b><br/>
			<small>Please select one supplier from the list below</small>
		</div>

		<div class="col-12 suppliers-invitation-check-list-search-section hide">
		</div>
		<div class="col-12 suppliers-invitation-check-list-section">
		</div>
		<br/>
		<details>
			<summary>
				<b>Remarks <span class="text-muted">(optional)</span></b><br/>
				<small>Click to write message</small>
			</summary>
			<div class="col-12">
				<textarea class="form-control" id="remarks" placeholder="(Optional)"></textarea>
			</div>
		</details>
		


		<br/><br/>
	</section>
	<center>
		<p class="text-default">Are you sure you want to continue?</p>
		<button class="btn btn-danger" id="modal-dialog-send-button" disabled="disabled">YES</button> 
		<button class="btn btn-secondary" id="modal-dialog-close-button">NO</button>
		<br/><br/>
	</center>
</section>
`

export { template }