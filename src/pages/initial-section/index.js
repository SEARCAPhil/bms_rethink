import style from './style'
const template = document.createElement('div')

template.name =  "/bids/initial"
template.id = 'initial-section'
template.classList.add('col', 'col-lg-9', 'col-sm-12', 'col-xs-12', 'max-height-panel')
template.innerHTML = `
  <style>${style.toString()}</style>
  <div class="col-lg-7 offset-lg-2 d-lg-offset-2 text-center" style="margin-top:70px;">
    <div style="float:left;width:100%;height:200px;background:url('assets/img/laptop.png') no-repeat center;background-size:contain;"></div>
    <br><br>
    <h2>Bidding Management System</h2>
    <small>
      <p class="text-muted">
        Compare supplier's price easier , faster and better than before! Be the first to use the new and advanced bidding management system 
      </p>
    </small>
    <button class="btn btn-dark" onclick="window.location='#/bids/forms/registration/steps/1'"> GETTING STARTED</button>
  </div>`


export default template