
export default class {
  constructor(opt = {}) {
    this.opt = opt
    return this.loadDialog()
  
  }

  async loadDialog () {
    const dialog = (await import('../dialog-pane')).default
    return new dialog(this.opt).then(res => {
      // open dialog pane
      res.open()
      this.render()

      // attach to DOM
      const sec = document.querySelector(`#${res.id} > .body`)
      sec.innerHTML = ''
      sec.append(this.template)

      setTimeout(() => {
        // load actions
        import('./actions').then(actions => {
          const attachments = new actions.default().upload({
            id: this.opt.id,
            selector: '#file-upload-attachment-bidding',
          })
        })
      },1000)

    })
  }

  render() { 
    this.template = document.createElement('section')
    this.template.classList.add('col-12', 'row')

    // custom classes
    if(this.opt.class) this.template.classList.add(...this.opt.class.split(' '))
    
    // template
    this.template.innerHTML = `
      <div class="col row" style="border-right: 1px solid rgba(200,200,200,0.5);padding-top: 100px;">
        <ul class="list-unstyled col">
          <li data-role="none">
            <h5>
              <i class="material-icons md-36">computer</i> Device  
            </h5>
            <hr/>
          </li>
          <li><small>Recent Attachments</small></li>
          <li>
            <small>
              <label for="file-upload-attachment-bidding" class="btn btn-dark btn-sm">Select file <i class="material-icons md-18">attach_file</i></label>
              <input id="file-upload-attachment-bidding" name="file-upload-attachment[]" class="hide" type="file" multiple/>
            </small>  
          </li>
        </ul>
      </div>
      <div class="col-9" style="padding-top: 100px;">
        <div class="col-lg-12" style="height: 70vh;">
          <p>Recently attached <i class="material-icons">navigate_next</i> <span class="text-muted">Files</span></p><br/>
          <hr/>
          <div class="recently-attached-section" id="recently-attached-section-${this.opt.id}"></div> 
        </div>
        <div class="col-lg-12">
          <button class="btn btn-sm btn-default" id="file-attachment-upload-recent-btn-${this.opt.id}" disabled="disabled">Attach</button> 
          <button class="btn btn-sm btn-default" id="file-attachment-main-dialog-cancel-btn-${this.opt.id}">CANCEL</button>
        </div>
      </div>
      `
    // start rendering
    return this.template
  }
}
      
      
      