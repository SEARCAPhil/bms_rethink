import style from './style'

export default class {
  constructor(opt = {}) {
    this.__timestamp = Date.now()
    return this.render(opt) 
  }

  render(opt = {}) { 
    this.template = document.createElement('article')
    this.template.style.fontSize = '0.9em'
    this.template.classList.add('row', 'col-12')

    // custom classes
    if(opt.class) this.template.classList.add(...opt.class.split(' '))
    
    // template
    this.template.innerHTML = `
      <style>${style.toString()}</style>
      <article class="row col-12">
          <section class="col-12 col-lg-7">
            
            <div class="media">
              <div class="text-center mr-3" style="float:left;width:35px;height:35px;overflow:hidden;background:#ffb80c;color:#fff;padding-top:5px" id="image-header-section">JO</div>
              <div class="media-body">
                <p class="mt-0"><b>John Kenneth G. Abella</b><br>
                Information Technology Services Unit<br>
                <a href="/api/bidding/reports/bidding_feedback.php?id=10" target="_blank" class="btn btn-default btn-sm" style="border:1px solid #009688;">
                  <i class="material-icons md-18">print</i> PRINT
                </a>
                </p>
              </div>
            </div>

            <p class="text-muted">Nice!!!!!!<br><span class="badge badge-dark">Compucare</span> <span class="badge badge-dark">HP Eliteone800</span></p>
          </section>

        <section class="col-12 col-lg-5 rate-section"><span>price<br><i class="material-icons md-18 star-ratings star-price active">star</i><i class="material-icons md-18 star-ratings star-price active">star</i><i class="material-icons md-18 star-ratings star-price active">star</i><i class="material-icons md-18 star-ratings star-price">star_border</i><br></span><span>quality<br><i class="material-icons md-18 star-ratings star-quality active">star</i><i class="material-icons md-18 star-ratings star-quality active">star</i><i class="material-icons md-18 star-ratings star-quality active">star</i><i class="material-icons md-18 star-ratings star-quality active">star</i><br></span><span>time<br><i class="material-icons md-18 star-ratings star-time active">star</i><i class="material-icons md-18 star-ratings star-time active">star</i><i class="material-icons md-18 star-ratings star-time">star_border</i><i class="material-icons md-18 star-ratings star-time">star_border</i><br></span></section>				    
      
      </article><br><br>
    `


    // start rendering
    return this.template
  }
}
