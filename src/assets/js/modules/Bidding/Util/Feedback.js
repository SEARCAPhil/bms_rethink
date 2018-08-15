import FeedService from '../Services/Feedback'

export class FeedList {
	constructor () {
		this.XHR = new window.bms.exports.XHR()
		this.FeedServ = new FeedService()
	}

	get (id) { 
		let data = {
			id,
			token: window.localStorage.getItem('token'),
		}

		return new Promise((resolve, reject) => {
			this.FeedServ.get(data).then((json) => {
				let res = JSON.parse(json)
				if(res[0]){
					resolve(res)
				}

			})
		})
	}
}



document.querySelectorAll('.feedback-list-section').forEach((el, index) => {
	const Feed = new FeedList()
	const id = el.id
	Feed.get(id).then((json) => {
		if (json.length > 0) {
			el.innerHTML = '<p class="col-12" style="border-bottom:1px solid rgba(200,200,200,0.3);padding-bottom:10px;margin-top: 60px;"><b>What other say about this supplier</b> <i class="material-icons md-18 float-right text-muted">expand_more</i></p>'
		}

		json.forEach((val, ind) => {
			const nameAlias = val.author[0].profile_name.substr(0,2).toUpperCase()
			const art = document.createElement('article')
			art.classList.add('row', 'col-12')

			art.innerHTML+=`
						<article class="row col-12">
						    <section class="col-12 col-lg-7">
						    	
						    	<div class="media">
								  <div class="text-center mr-3" style="float:left;width:35px;height:35px;overflow:hidden;background:#ffb80c;color:#fff;padding-top:5px" id="image-header-section">${nameAlias}</div>
								  <div class="media-body">
								    <p class="mt-0"><b>${val.author[0].profile_name}</b><br>
										${val.author[0].department}
								    </p>
								  </div>
								</div>

								<p class="text-muted">${val.feedback}</p>
						    </section>

							<section class="col-12 col-lg-5 rate-section"></section>				    
						
						</article><br/><br/>
			`
			const rateSec = art.querySelector('.rate-section')

			val.ratings.forEach((rateVal, rateIndex) => {
				const span = document.createElement('span')
				span.innerHTML = window.bms.default.state.bidding.cur.requirements.criteriaArray[rateVal.name] || `${rateVal.name}`
				span.innerHTML += '<br/>'

				for (let  x = 0; x < 4; x++) {
					const star = document.createElement('i')
					star.classList.add('material-icons', 'md-18', 'star-ratings', `star-${rateVal.name}`)

					if (x < rateVal.value) {
						star.textContent = 'star'
						star.classList.add('active')	
					} else {
						star.textContent = 'star_border'
					}
					
					star.position = x
					star.criteria = rateVal.name
					span.append(star)	
				}

				span.append(document.createElement('br'))

				rateSec.append(span)

			})

			el.append(art)
		})
	})
})