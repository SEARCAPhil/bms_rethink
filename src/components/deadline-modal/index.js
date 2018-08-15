import style from './style'
const template = `
<section class="deadline-modal-section">
  <style>${style.toString()}</style>
  <center>
  <h3>Set Deadline</h3>
  <p>This will only allow suppliers to submit their proposals within specified date.</p>

  <p><input type="date" class="form-control" placeholder="date" id="deadline"/></p>

  <button class="btn btn-danger" id="modal-dialog-send-button">SAVE</button> 
  <button class="btn btn-secondary" id="modal-dialog-close-button">CANCEL</button>
</center>
</section>`

export { template }