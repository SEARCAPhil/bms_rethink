import style from './style'

const template = `
  <section class="send-req-modal-section"">
    <style>${style.toString()}</style>
    <h3>Request new proposal</h3>
    <small class="text-muted"><p>This will notify the supplier that you are requesting for changes with their proposal</p></small>
  
    <p>
      <small class="text-danger">
        * Required
      </small>
    </p>
    <textarea class="form-control" placeholder="Reason/ Details why you are requesting for new proposal" style="height: 300px;" id="reason" required></textarea>
  
  
    <br/><br/>
    <center>
      <button class="btn btn-danger" id="modal-dialog-send-button">SEND</button> 
      <button class="btn btn-secondary" id="modal-dialog-close-button">CANCEL</button>
    </center>
  </section>
  
`

export { template }