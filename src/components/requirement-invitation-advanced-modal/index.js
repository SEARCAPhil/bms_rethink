import style from './style'

const template = `
  <style>${style.toString()}</style>
  <main class="send-req-modal-section">
    <h3><i class="material-icons">mail</i> Send</h3>
    <p class="text-danger">Please select item(s) and supplier(s) below</p>
    <hr/>
    <!-- items -->
    <div class="col-12">
      <b>Items / Services</b>
    </div>
    <section class="item-sending-list-section">
      <div class="col-12 row"></div>
    </section>
    <!-- suppliers -->

    <details>
      <summary>Suppliers</summary>
      <input type="text" class="form-control" placeholder="Search supplier" id="search-supplier">

      <div class="suppliers-invitation-sending-list-section  d-flex flex-wrap"></div>
      

      <div class="suppliers-invitation-check-list-search-section hide">
      </div>
      <div class="suppliers-invitation-check-list-section">
      </div>
    </details>

    <br/><br/>

    <p class="text-default">Are you sure you want to continue?</p>
    <button class="btn btn-danger" id="modal-dialog-send-button" disabled="disabled">YES</button> 
    <button class="btn btn-secondary" id="modal-dialog-close-button">NO</button>
</section>
`
export { template }