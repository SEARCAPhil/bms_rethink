import style from './style'

const template = `
  <style>${style.toString()}</style>
  <section class="remove-modal-section">
    <center>
      <h3>Change Password</h3>
      <small class="text-muted">Changing password might affect user's accessibility. Please proceed with caution.</small>
      <section class="row mb-5 mt-3">

        <div class="col-12 mb-1">
          <input type="password" name="password2" class="form-control password" placeholder="Password"/>
        </div>

        <div class="col-12">
          <input type="password" name="password2" class="form-control password2" placeholder="Confirm Password"/>
        </div>

      </section>
      <button class="btn btn-danger" id="modal-dialog-remove-button">CONFIRM</button> 
      <button class="btn btn-secondary" id="modal-dialog-close-button">CANCEL</button>
    </center>
  </section>
`

export { template }