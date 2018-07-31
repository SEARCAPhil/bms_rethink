import style from './style'
export default class {
	constructor (opt = {}) {
    this.opt = opt
    return this.render().__show()
  }

  __close () {
    this.classList.remove('open')
  }

  close (e) {
	  return  e.target.classList.contains('file-attachment-main-dialog') ? document.querySelector(`#file-attachment-main-dialog-${this.opt.id}`).classList.remove('open')  : false
  }
  
  open (e) {
	  return setTimeout(() => { document.querySelector(`#file-attachment-main-dialog-${this.opt.id}`).classList.add('open') }, 10)
  }
  
	cancel () {
		return document.querySelector(`#file-attachment-main-dialog-${this.opt.id}`).classList.remove('open')
  }
  
	render () {
		const proto = Object.assign({ __proto__: this.__proto__ }, this)
		const template = document.createElement('section')
    template .classList.add('col', 'col-lg-12', 'file-attachment-main-dialog')
    
		//unique dialog box
    template.id = `file-attachment-main-dialog-${this.opt.id}`
    template.close = this.__close
		template.addEventListener('click', this.close.bind(proto))
		template.innerHTML = `
			<style>${style.toString()}</style>
      <section class="col col-lg-6 row float-right d-flex align-items-stretch body" style="height: 100vh;background: #fff;box-shadow: -30px 0 30px -30px rgba(0,0,0,.2);"></section>
    `
    let closebtn = template.querySelector(`#file-attachment-main-dialog-cancel-btn-${this.opt.id}`)
    closebtn = closebtn ? closeBtn.addEventListener('click', this.cancel.bind(proto)) : false
    template.open = this.open.bind(proto)
    this.template = template
    return this
  }

  /**
   * Add to DOM only ONCE
   *
   * @returns promise
   */
  __show () {
    return new Promise((resolve, reject) => {
      let res = (!document.querySelector(`#file-attachment-main-dialog-cancel-btn-${this.opt.id}`)) ? document.querySelector(this.opt.target).append(this.template) : false
      resolve(this.template)
    })
    
  }
}