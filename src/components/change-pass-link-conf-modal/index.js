import style from './style'

const template = `
  <style>${style.toString()}</style>
  <section class="remove-modal-section">
    <center>
      <h3>Send Reset Password</h3>
      <small class="text-muted">Send reset password confirmation link to his email. Are you sure you want to continue ?</small><br/><br/>
      <button class="btn btn-danger" id="modal-dialog-remove-button">YES</button> 
      <button class="btn btn-secondary" id="modal-dialog-close-button">NO</button>
    </center>
  </section>
`

export { template }