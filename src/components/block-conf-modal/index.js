import style from './style'

const template = `
  <style>${style.toString()}</style>
  <section class="remove-modal-section">
    <center>
      <h3>Block/Unblock</h3>
      <p>You are about to change the status of this account that will prevent him from accessing or modifying any data. Are you sure you want to continue?</p>
      <button class="btn btn-danger" id="modal-dialog-remove-button">YES</button> 
      <button class="btn btn-secondary" id="modal-dialog-close-button">NO</button>
    </center>
  </section>
`

export { template }