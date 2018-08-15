import style from './style'

const template = `
  <section class="send-req-modal-section">
    <style>${style.toString()}</style>
    <style>.send-req-modal-section:after { background:url('assets/img/confetti.png') repeat center; } </style>
    <center style="padding: 10px;">
      <img src="./assets/img/star.png" width="150px">
      <h2 style="color:#464a4e;">Award</h2>
      <p>Officiay award this bidding to the selected proposal/supplier</p>
      <section  style="padding: 20px;color:#818182;">
        <button class="btn btn-danger" id="modal-dialog-send-button">CONTINUE</button> 
        <button class="btn btn-secondary" id="modal-dialog-close-button">NO</button>
      </section>
    </center>
  </section>`

export { template }