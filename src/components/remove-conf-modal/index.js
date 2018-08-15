import style from './style'

const template = `
  <style>${style.toString()}</style>
  <section class="remove-modal-section">
    <center>
      <h3>Remove</h3>
      <p>This will be removed permanently in the system and could no be longer recover. Are you sure you want to continue?</p>
      <button class="btn btn-danger" id="modal-dialog-remove-button">YES</button> 
      <button class="btn btn-secondary" id="modal-dialog-close-button">NO</button>
    </center>
  </section>
`

export { template }