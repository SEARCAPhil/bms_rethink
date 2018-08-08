import style from './style'

const template = `
  <section class="remove-modal-section">
    <style>${style.toString()}</style>
    <center><br/>
      <h3>Upload Award Letter / Resolution </h3>
      <p class="text-muted">Please attach scanned award letter.</p>
    </center>

    <center>
      <button class="btn btn-danger" id="modal-dialog-send-button"><i class="material-icons md-18">attach_file</i> Attach</button> 
    </center>
  </section>
  `

export { template }