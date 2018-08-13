export default class {
  constructor (opt) {
    this.opt = opt
    this.template = {}
    return this.render() 
  }


  /**
   * Return template as HTMLObject to be rendered in DOM
   */
  async render () {
    
    this.template = document.createElement('section')
    this.template.classList.add('row')
    this.template.innerHTML = `
      <article class="col-xs-12 col-md-12 col-lg-10 offset-lg-1 col-xs-12" style="margin-top: 8vh;overflow:auto;padding-bottom: 30px;">
      <section id="reg-notif-area"></section>
    
      <section class="row col-md-12"><br/><br/><br/></section>
    
      <form class="form-horizontal row" name="bidding-request-requirements" onsubmit="return false;">
      
        <section class="col-md-12">
          <h3 class="text-success"><i class="material-icons">check_circle</i> Success!</h3>
          <p>Thank you for submitting an item for bidding. Do you want to submit more ?</p>
        </section>
    
        <section class="col col-md-12 success-menu">
          <br>	
          <a href="#/bids/forms/registration/${this.opt.id}/step/3" class="btn btn-dark btn-md add-supplier-button">Add more</a>&nbsp;
          <a href="#/bids/requirements/${this.opt.pid}" class="btn btn-success btn-md add-supplier-button">Done</a>
        </section>
    
      </form>
    </article>`
    return this.template
  }
}
