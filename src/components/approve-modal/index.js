import style from './style'
const template = `
<section class="remove-modal-section">
  <style>${style.toString()}</style>
  <center>
    <h3>Approve</h3>
    <p>You will not be able to make any changes once you approve this bidding request. Are you sure you want to continue?</p>

    <button class="btn btn-danger" id="modal-dialog-send-button">YES</button> 
    <button class="btn btn-secondary" id="modal-dialog-close-button">NO</button>
  </center>
</section>`

export { template }