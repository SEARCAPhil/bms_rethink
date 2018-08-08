import style from './style'
import styleRatings from '../general-style/star-ratings'

export default class {
  constructor(opt = {}) {
    this.opt = opt
    this.criteriaToBeSaved = {}
    this.criteria = [{
      name: 'price',
      alias: 'Price'
    },{
      name: 'quality',
      alias: 'Goods/ Service Quality'
    },{
      name: 'time',
      alias: 'Delivery Time'
    }]
    return this.render(opt) 
  }

  __listeners (opt) {
    import('./actions/award').then(loader => {
      return new loader.default({
        root: this.template,
        selector: '.award-list-modal-btn',
        id: opt.id,
      })
    })
  }

  __saveRating (e) { console.log(this.opt)
    // ctrl + enter
    if (e.ctrlKey && e.target.value.length > 3) {
      // all criteria must be rated
      if(Object.keys(this.criteriaToBeSaved).length != this.criteria.length) return 0
      // disable form
      e.target.disabled = 'disabled'

      // payload
      const __payload = {
        id: this.opt.bidding_requirements_id,
        supplier_id: this.opt.id,
        feedback: e.target.value,
        ratings: this.criteriaToBeSaved,
        token: window.localStorage.getItem('token'),
        action: 'create'
      }
      // save feedback
      import('../../services/bidding-req-service').then(res => {
        
        new res.default().sendFeedbackToAwardee(__payload).then(json => {
          if(json > 1) window.location.reload()
        })
      })  

    }
  }

  __giveFeedback (opt) {
    const uniqueId = new Date().getTime()
    const __proto = Object.assign({__proto__ : this.__proto__}, this)
    // rating's criteria
    this.criteria.forEach((val, index) => {
      const span = document.createElement('span')
      span.innerHTML = `${val.alias}`

      for (let  x = 0; x < 4; x++) {
        const star = document.createElement('i')
        star.classList.add('material-icons', 'md-18', 'star-ratings', `star-${val.name}`, `star-group-${uniqueId}`)
        star.textContent = 'star_border'
        star.position = x
        star.criteria = val.name
        star.addEventListener('click', this.rate.bind(__proto))
        span.append(star)	
      }

      span.append(document.createElement('br'))
      this.template.querySelector('.rating-section').append(span)
    })


    // feedback form
    const textArea = document.createElement('textArea')
    textArea.classList.add('form-control')
    textArea.groupId = uniqueId
    textArea.supplierId = opt.id
    textArea.placeholder = 'Say something about your experience with this supplier'
    textArea.setAttribute('style', 'border:1px solid #ccc !important;')
    textArea.addEventListener('keyup', this.__saveRating.bind(__proto))

    const saveProcedure = document.createElement('small')
    saveProcedure.innerHTML = 'Press <span class="badge badge-dark">CTRL</span> key + <span class="badge badge-dark">ENTER</span> to save'

    // Insert to DOM
    this.template.querySelector('.rating-feedback-section').append(textArea)
    this.template.querySelector('.rating-feedback-section').append(saveProcedure)
  }

  __getFeedbacks (opt) {
    const reqServ = import('../../services/bidding-req-service')

    this.template.querySelectorAll('.feedback-list-section').forEach((el, index) => {
      // id
      const __payload = {
        id: this.opt.id,
        token: window.localStorage.getItem('token')
      }
      
      // get from DB
      reqServ.then(res => {
        new res.default().getFeedbackAwardee(__payload).then(json => {
          if (json.length > 0) {
            el.innerHTML = '<p class="col-12" style="border-bottom:1px solid rgba(200,200,200,0.3);padding-bottom:10px;margin-top: 60px;"><b>What other say about this supplier</b> <i class="material-icons md-18 float-right text-muted">expand_more</i></p>'
          }  
        

          json.forEach((val, ind) => {
            const nameAlias = val.author[0].profile_name.substr(0,2).toUpperCase()
            const art = document.createElement('article')

            art.classList.add('row', 'col-12')
            art.innerHTML+=`
              <article class="row col-12">
                  <section class="col-12">
                    <div class="media">
                    <div class="text-center mr-3" style="float:left;width:35px;height:35px;overflow:hidden;background:#ffb80c;color:#fff;padding-top:5px" id="image-header-section">${nameAlias}</div>
                    <div class="media-body">
                      <p class="mt-0"><b>${val.author[0].profile_name}</b><br>
                      ${val.author[0].department}
                      </p>
                    </div>
                  </div> 
                  </section>

                <section class="col-12 rate-section"></section><br/><br/>	
                <section class="col-12"><br/>	<p class="text-muted">${val.feedback}</p><hr/></section>
              </article><br/><br/>
            `
            const rateSec = art.querySelector('.rate-section')
            val.ratings.forEach((rateVal, rateIndex) => {
              const span = document.createElement('span')
              span.innerHTML = this.criteria[rateVal.name] || `${rateVal.name}`
              span.innerHTML += '&emsp;'

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
    })
  }

  rate (e) { 
    // copy element
    const newEl = e.target.cloneNode()
    newEl.textContent = 'star'
    newEl.classList.add('active')
  
    e.target.parentNode.querySelectorAll(`.star-${e.target.criteria}`).forEach((el, index) => {
      if (el.position > e.target.position) {
        el.textContent = 'star_border'
        el.classList.remove('active')
      } else {
        el.textContent = 'star'
        el.classList.add('active')
        this.criteriaToBeSaved[e.target.criteria] = e.target.position+1
      }
    })	
  }
  

  render(opt = {}) { 
    this.template = document.createElement('div')
    this.template.classList.add(`requirement-awardees-item-${opt.id}`, 'row')
    this.__stat = ''
    // custom classes
    if(opt.class) this.template.classList.add(...opt.class.split(' '))
    
    // template
    this.template.innerHTML = `
      <style>${style.toString()} ${styleRatings.toString()}</style>
     

      <details class="col-10 row">
        <summary> <span class="text-success">${opt.name}</span> ${this.__stat}</summary><br/>
        <p class="col-12">
         
        </p>

        <p class="col-12 text-muted">${opt.remarks}</p>
        <section class="feedback-list-section"></section>
        <feedback-section>
          <p class="col-12" style="border-bottom:1px solid rgba(200,200,200,0.3);padding-bottom:10px;margin-top:50px;">
            <b><i class="material-icons md-18">insert_comment</i> How will you rate this supplier ?</b> 
            <i class="material-icons md-18 float-right text-muted">expand_more</i>
          </p>
        </feedback-section>
        <section class="col-12 rating-section"></section>
        <p class="col-12  rating-feedback-section"><br/></p>
			</details> 
       
        ${
          opt.status == 2 ? `<span class="col-2 float-right" style="color:#ffb80c;" data-resources="${opt.id}" id="${opt.id}"><i class="material-icons md-18">star</i> Awarded</span>`:
          `<a class="award-list-modal-btn text-danger" id="${opt.id}" data-resources="${opt.id}" data-target="#general-modal" data-popup-toggle="open">
            <i class="material-icons md-18">card_membership</i> Click to Award
          </a>`
        }
      </span>`
      this.__listeners(opt)
      this.__giveFeedback(opt)
      this.__getFeedbacks(opt)
    // start rendering
    return this.template
  }
}
