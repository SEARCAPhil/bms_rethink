import style from './style'

const template = `
  <section class="send-req-modal-section">
    <style>${style.toString()}</style>
    <h3>Send</h3>
    <small class="text-muted">
      <p>Please review before sending. You will not be able to make any changes after you send it to the recepient.
      Only proceed if you know what you are doing.
      </p>
    </small>
    <hr/>

    <div class="cba-invitation-sending-list-section  d-flex flex-wrap"></div>
    <!--<div class="col-12"><br/><b>CBA Assistant(s)</b></div>-->
    <div class="cba-invitation-check-list-search-section hide">
    </div>
    <div class="cba-invitation-check-list-section"></div>


    <br/><br/>
    <p class="text-default">Are you sure you want to continue?</p>
    <button class="btn btn-danger" id="modal-dialog-send-button" disabled="disabled">YES</button> 
    <button class="btn btn-secondary" id="modal-dialog-close-button">NO</button>
  </section>`

  export { template }