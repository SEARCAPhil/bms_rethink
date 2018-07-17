import style from './style'

const template = `
  <section class="remove-modal-section">
    <style>${style.toString()}</style>
    <center>
      <h3>Send</h3>
      <p>You will not be able to update the content of this item after you send it to the recepient. Are you sure you want to continue?</p>
      <button class="btn btn-danger" id="modal-dialog-send-button">YES</button>
      <button class="btn btn-secondary" id="modal-dialog-close-button">NO</button>
    </center>
  </section>
`

export { template }