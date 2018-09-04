import style from './style'
const template = document.createElement('div')

template.name =  "/bids/initial"
template.id = 'initial-section'
template.classList.add('row')
template.innerHTML = `
  <style>${style.toString()}</style>
  <div class="col-lg-8 offset-lg-2 d-lg-offset-2 text-center" style="margin-top:70px;">
    <div style="float:left;width:100%;height:200px;background:url('assets/img/analysis.png') no-repeat center;background-size:contain;margin-bottom:50px;"></div>
    <br><br>
    <h2>Supplier's Database</h2>
    <small>
      <p class="text-muted">
        Save all your suppliers in one place with maximum security
      </p>
    </small>
    <button class="btn btn-dark" onclick="window.location.href = '#/suppliers/all'"> SHOW RECORDS</button>
  </div>`


export default template