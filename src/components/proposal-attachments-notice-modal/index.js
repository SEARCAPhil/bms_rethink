import style from './style'

const template = `
  <section class="send-req-modal-section">
    <style>${style.toString()}</style>
    <center><br/>
      <h4>Please attach scanned formal quotation</h4>
      <p class="text-muted">Follow the instructions below to upload file</p>
      <section class="col-12">
        <img src="./assets/img/attachment-steps.png" width="100%">
      </section>	
    </center>
    <center>
      <button class="btn btn-danger btn-block" id="modal-dialog-send-button" onclick="window.location.reload();"><i class="material-icons md-18">refresh</i> Reload Now</button> 
    </center>
  </section>
`

export { template }