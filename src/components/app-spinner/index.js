import style from './style'

export default class{
	constructor(opt = {}){
		this.opt = opt
		this.opt.style = this.opt.style || ''
		this.opt.class = this.opt.class || []
		this._spinnerWrapperClass = 'spinner-container'
		this._spinnerWrapperClassSelector = '.' + 'spinner-container'
    this.render()
    return this
  }
  
  __show (e) {
    this.classList.add('open')  
  }

  __hide (e) { 
    this.classList.remove('open')  
  }

	render(){
		this.template = document.createElement('div')
    this.template.classList.add(this._spinnerWrapperClass, 'spinner')
    this.opt.class.forEach(val => this.template.classList.add(val))
		this.template.setAttribute('style',this.opt.style)
    this.template.innerHTML = ` 
        <style>${style.toString()}</style>
				<div class="block"></div>
		  		<div class="block"></div>
		  		<div class="block"></div>
		  		<div class="block"></div>
		  		<div class="block"></div>
          <div class="block"></div>`
    // add listeners
    this.template.show = this.__show
    this.template.hide = this.__hide
		return this.template
	}

	show(opt = {}){ 
    const __target = this.opt.target || opt.target
    const el = document.querySelectorAll(__target)

    return new Promise((resolve, reject) => {
      for (var e of el) {
        if(!e.querySelector('.spinner')) { 
          e.prepend(this.template) 
        } else { 
          e.querySelector('.spinner').replaceWith(this.template)
        }
        
        resolve(this)
      }
    })
	}
}