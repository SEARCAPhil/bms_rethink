
import style from './style'

const template = `
  <style>${style.toString()}</style>
  <section class="deadline-modal-section">
	<main>
		<h3>Change Signatories</h3>
		<small><p class="text-muted">Please review the original bidding request bidding report before doing any changes.</p></small>
		<hr/>

		<details>
			<summary><b>Requested By</b></summary>
			<small><p class="text-danger">Leave blank to use the default value</p></small>
			<p><input type="text" class="form-control" placeholder="Name (default)" id="requested" list="requested_name"/></p>
			<p><input type="text" class="form-control" placeholder="Position (default)" id="requested_position" list="requested_position_title"/></p><br/>
		</details>
		
		
		<details>
			<summary><b>Recommended By</b></summary>
			<small><p class="text-danger">Leave blank to use the default value</p></small>
			<p><input type="text" class="form-control" placeholder="Name (default" id="recommending" list="name"/></p>
			<p><input type="text" class="form-control" placeholder="Position (default)" id="recommending_position" list="position"/></p><br/>
		</details>

		
		<details open>
			<summary><b>Approved By</b></summary>	
			<small><p class="text-danger">Leave blank to use the default value</p></small>
			<p><input type="text" class="form-control" placeholder="name (default)" id="approved" list="name"/></p>
			<p><input type="text" class="form-control" placeholder="Position (default)" id="approving_position" list="position"/></p><br/>
		</details>


		<!-- Requested -->
		<datalist id="name">
		  <option value="Adoracion T. Robles">
		  <option value="Gil C. Saguiguit Jr.">
		</datalist>

		<datalist id="position">
			<option value="Chair, CBA">
			<option value="Director">
		 	<option value="Unit Head, Management Services and Executive Coordinator, Office of the Director">
		 	<option value="Vice Chair, CBA">	
		</datalist>

		<!-- Unit Head -->
		<datalist id="requested_name">
			<option value="Adoracion T. Robles">
			<option value="Gil C. Saguiguit Jr.">
			<option value="Jaymark Warren T. Dia">
			<option value="Ricardo A. Menorca">
		  	<option value="Maria Celeste H. Cadiz">
		  	<option value="Nancy M. Landicho">
		  	<option value="Eidelmine Elizabeth F. Genosa">
		  	<option value="Virginia H. Gomez">
		  	<option value="Julita G. Ventenilla">
		  	<option value="Billie Boy J. Navarro">
		  	<option value="Maria Cristeta N. Cuaresma">
		  	<option value="Fernando B. Artates">
		</datalist>

		<datalist id="requested_position_title">
			<option value="Chair, CBA">
			<option value="Director">
		 	<option value="Unit Head, Management Services and Executive Coordinator, Office of the Director">
		 	<option value="Vice Chair, CBA">
		 	<option value="ITSU Coordinator">
		 	<option value="Accounting Head">
		 	<option value="Unit head, Facilities">
		 	<option value="Unit head, General Services">
		 	<option value="Program Head, GEIDD">
		 	<option value="Program Head">
		 	<option value="Unit Head, Internal Audit">
		 	<option value="Unit Head, Human Resources">
		 	<option value="OIC Program Head, PDTS">	
		 	<option value="Unit head, Accounting">	
		</datalist>


		<br/>

		<button class="btn btn-danger" id="modal-dialog-send-button">SAVE</button> 
		<button class="btn btn-secondary" id="modal-dialog-close-button">CANCEL</button>
	</main>
</section>
`

export { template }