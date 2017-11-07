export default class{
	constructor(options){
		this.options=options||{}
		this.options.style=this.options.style||''
		this.options.class=this.options.class||''
		this._spinnerWrapperClass='spinner-container'
		this._spinnerWrapperClassSelector='.'+'spinner-container'
		this._template= this._createTemplate()
		return this
	}

	_createTemplate(){
		this._element=document.createElement('div')
		this._element.setAttribute('class',this._spinnerWrapperClass+' '+this.options.class)
		this._element.setAttribute('style',this.options.style)
		this._element.innerHTML=` 
				<div class="block"></div>
		  		<div class="block"></div>
		  		<div class="block"></div>
		  		<div class="block"></div>
		  		<div class="block"></div>
		  		<div class="block"></div>`

		return this._element
	}

	show(){

		let el=document.querySelectorAll(this.options.target)

		//this.hide().then(()=>{ console.log(el)
			return new Promise((resolve,reject)=>{
				for(var x of el){
					x.prepend(this._template)
					resolve(this)
				}
			})
		//})

		
	}

	hide(){

		let el=document.querySelectorAll(this.options.target)

		return new Promise((resolve,reject)=>{
			for(var x of el){
				var elNodes=x.children
				var elNodesLength=elNodes.length
				
				for(let i=0; i<elNodesLength;i++){
					if(elNodes[i].classList.contains(this._spinnerWrapperClass)){
						elNodes[i].parentNode.removeChild(elNodes[i])
					}
					resolve(this)
				}
				
			}
		})
	}



}