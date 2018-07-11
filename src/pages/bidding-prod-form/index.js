import style from '../../components/general-style/circle-marker'

const template = document.createElement('section')
template.classList.add('row')
template.innerHTML = `
  <style>${style.toString()}</style>
	<article class="col-xs-12 col-md-12 col-lg-10 offset-lg-1 col-xs-12" style="margin-top: 10vh;overflow:auto;padding-bottom: 200px;">
    <section id="reg-notif-area"></section>
    
		<section class="row col-md-12"><br/><br/><br/>
			<h2><span class="circle-marker"><i class="material-icons md-24">add_shopping_cart</i></span> Products / Services</h2>
    </section>
    
		<section class="col-md-12">
			<p>Please complete all the fields below. Make sure that you checked all information before submitting. </p>
		</section>

		<form class="form-horizontal row" name="bidding-request-requirements" onsubmit="return false;">
			<section class="col-md-12">
				<hr/>
					<span id="bid-form-requirement-status"></span>
					<p>
						<b><span class="text-green">Item Name / Service</span> <small class="text-muted">(Required)</small> </b> 
						<p class="text-muted"><small>e.i. HP Eliteone 800 G3, APC UPS, etc...</small></p>
						<input type="text" name="name" class="form-control" id="name" autofocus>
					</p>
					
					<span class="row">
					    <div class="col-lg-4 col-md-4">
					    	<b><span  class="text-green">Quantity</span> </b> 
					    	<p class="text-muted">Number of items needed</p>
					    	<input type="text" name="quantity"  placeholder="#" class="form-control">
					    </div>
					    <div class="col-lg-7 col-md-7">
					    	<b><span  class="text-green">Unit</span></b> 
					    	<p class="text-muted"><small>pack , piece , sacks etc..</small></p>
					    	<input type="text" name="unit" class="form-control" placeholder="Unit of measurements">
					    </div>
					</span>

					<br/>
					<p><b><span class="text-green">Source of Fund</span></b></p>
					<div class="source_of_fund_section">
						<span class="row  funds-input-section">
							<div class="col-lg-3 col-md-3">

						 		<select class="form-control" id="fund-type" name="fund-type">
									<option value="OpF">Select source of fund</option>
									<option value="OpF">Operating Funds</option>
									<option value="OtF" id="otf">Other Funds</option>
									<option value="OP">Obligations Payable</option>
									<option value="SF">Special Funds</option>
									<option value="OpFs">Operating Funds(Scholar)</option>
									<option value="OtFs">Other Funds(Scholar)</option>
								</select>
						    </div>
						    <div class="col-lg-4 col-md-4">
						    	<input type="text" class="form-control" name="cost-center" placeholder="Cost Center / Project Name">
						    </div>
						    <div class="col-lg-4 col-md-4">

						 		<select class="form-control" id="line_item" name="line-item">
									<option value="">Select Line Item</option>
									<option value="Capital Expenditures">Capital Expenditures</option>
									<option value="Repairs and Maintenance">Repairs and Maintenance</option>
									<option value="Seminars and Conferences">Seminars and Conferences</option>
									<option value="Supplies">Supplies</option>
									<option value="Communication">Communication</option>
									<option value="Utilities">Utilities</option>
									<option value="Fund Raising">Fund Raising</option>
									<option value="Public Relations">Public Relations</option>
									<option value="Representation">Representation</option>
									<option value="Professional Services">Professional Services</option>
									<option value="Publications">Publications</option>
									<option value="Insurance">Insurance</option>
									<option value="Grants and Awards">Grants and Awards</option>
									<option value="Other Services">Other Services</option>
									<option value="Staff Development">Staff Development</option>
									<option value="Miscellaneous">Miscellaneous</option>
									<option value="Scholarships">Scholarships</option>
									<option value="Contingency">Contingency</option>
									<option value="Travel">Travel</option>
									<option value="Salaries and Wages">Salaries and Wages</option>
									<option value="Staff Benefits">Staff Benefits</option>
								</select>
						    </div>
						    <div class="col-lg-1 col-md-1">
						 		<div class="btn-circle add-fund-btn"><i class="material-icons">add</i></div>
						    </div>
						</span>
					</div>

					<br/>
					<p><b><span  class="text-green">Budget</span></b></p>
					<span class="row">
						<div class="col-lg-3 col-md-3">
					    	<select class="form-control" name="currency">
					 			<option value="PHP">PHP</option>
					 			<option value="USD">USD</option>
					 		</select>
					    </div>
					    <div class="col-lg-9 col-md-9">
					    	<input type="text" name="amount" class="form-control" id="budget" placeholder="Amount">
					    </div>
					</span>


					<br/>
					<div style="display:none;">
						<p><b><span  class="text-green">Bidding exception ?</span></b></p>
						<div class="form-group">
			              <div class="radio">
			                <label>
			                  <input type="radio" name="excemption" value="1" checked=""><span class="circle"></span><span class="check"></span>
			                  Yes
			                </label>
			              </div>
			              <div class="radio">
			                <label>
			                  <input type="radio" name="excemption" value="0"><span class="circle"></span><span class="check"></span>
			                  No (Normal bidding process)
			                </label>
			              </div>
			            </div>
			           </div>


		            <br/>

					<p><b><span class="text-green">Specifications</span></b></p>
					<p class="text-muted"><small>Write complete specification for this product/service</small></p>

					<div class="specs-section">
						<span class="row specs-input-section">
						    <div class="col-lg-4 col-md-4">
						    	<input type="text" name="specs-name" placeholder="Name" class="form-control specs-name specs-field">
						    </div>
						    <div class="col-lg-7 col-md-7">
						    	<input type="text" name="specs-value" class="form-control specs-field" placeholder="Value">
						    </div>
							 <div class="col-lg-1 col-md-1">
								<div class="btn-circle add-specs-btn"><i class="material-icons">add</i></div>
							</div>
						</span>
					</div>
			</section>

			<section class="col col-md-12 pull-right">
				<br/>	
				<button class="btn btn-dark add-supplier-button float-right">SAVE <i class="material-icons">save</i></button>
			</section>
		</form>


	</article>
`
export { template }