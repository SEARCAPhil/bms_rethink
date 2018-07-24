import style from './style'
const template = document.createElement('div')

template.name =  "/bids/initial"
template.id = 'initial-section'
template.classList.add('col', 'col-lg-10', 'col-sm-12', 'col-xs-12', 'max-height-panel')
template.innerHTML = `
  <style>${style.toString()}</style>
  <div class="col-lg-7 offset-lg-2 d-lg-offset-2 text-center" style="margin-top:70px;">
    <div style="float:left;width:100%;height:200px;background:url('assets/img/mail.png') no-repeat center;background-size:contain;"></div>
    <br><br>
    <h2>Send your proposal anytime, anywhere</h2>
    <small>
      <p class="text-muted">
      Select an invitation from the list and start your awesome proposal
      </p>
    </small>
    <button class="btn btn-dark"> GETTING STARTED</button>
  </div>`


export default template