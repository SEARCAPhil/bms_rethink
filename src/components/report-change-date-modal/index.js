import style from './style'

const template = `
  <section class="remove-modal-section">
    <style>${style.toString()}</style>
    <center>
      <i class="material-icons md-48" style="font-size:6em;">date_range</i>
          <h3>Select Date</h3>
          <small>Plese avoid date not more than 5 years as it will yield too much information and might take long to display</small>
      </center>
      <section>   
      <div class="form-group">
              <b>From :</b><br/>
              <input type="date" class="form-control" id="date-from-field"/>
          </div>
  
          <div class="form-group">
              <b>To :</b><br/>
              <input type="date" class="form-control" id="date-to-field"/>
          </div>
      </section> 
      <center>
      <button class="btn btn-danger" id="modal-dialog-send-button">OK</button> 
      <button class="btn btn-secondary" id="modal-dialog-close-button">CANCEL</button>
    </center>
`

export { template }