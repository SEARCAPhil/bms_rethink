import style from './style'

const template = document.createElement('section')
template.classList.add('row')
template.innerHTML = `
	<style>${style.toString()}</style>
	<article class="col-xs-12 col-md-12 col-lg-10 offset-lg-1 col-xs-12" style="margin-top: 150px;overflow:auto;padding-bottom: 30px;">
		<section id="reg-notif-area"></section>

		<section class="col-md-12 text-center throbbing-section">
			<p>
				<h2><img src="assets/img/coffee.png" width="50px"> One moment please . . .</h2>
				<p>
					We always like to make everything easier for you. <br/>Simply answer the question below and we are good to go!
				</p>
				<p>
					<br/><br/>
					<section class="col-12" style="position: relative;">
						<h3 class="throbbing fill-up-button">
							<a href="#" onclick="event.preventDefault();document.querySelector('[name="bidding-request-registration"]').classList.remove('hide');">
								Answer<br/>
								<i class="material-icons md-36">expand_more</i>
							</a>
						</h3>
					</section>
				</p>
			</p>
			<br/><br/><br/>
		</section>

		<section id="bid-form-status"></section>

		<form class="form-horizontal row" name="bidding-request-registration" onsubmit="return false;">
			<section class="col-md-12">
				<center>
					<small>
						<b><span>Do you PREFER bidding exemption ?</span></b>
						<p>This will allow CBA assistant to know if you want a bidding exemption. <br/>Please keep in mind that the final decision is still under CBA Assistant's control</p>
					</small>
					<input type="radio" name="forExemption"  id="exemption" value="0" checked="checked"> No <span class="text-muted">(Normal Bidding Process)</span> &emsp;
					<input type="radio" name="forExemption"  id="exemption" value="1"> Yes</p>
					<button class="btn btn-dark btn-md add-bidding-button" style="width:300px;">Next</button>
				</center>
			</section>
		</form>
	</article>
`
export { template }