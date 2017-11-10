
export default class{
	constructor(handle,target){
		this.element=document.querySelectorAll(handle)
		this.target=document.querySelectorAll(target)
		return this
	}
	toggle(){
		this.element.forEach((val,index)=>{
			let __toggleCallback=this._toggleDocker.bind(this)
			val.removeEventListener('click',__toggleCallback)
			val.addEventListener('click',__toggleCallback)
		})
		
	}

	toggleDockerClosed(){
		this.target.forEach((val,index)=>{
			val.classList.remove('show')
			val.classList.add('hide')
		})
	}

	toggleDockerOpen(){
		this.target.forEach((val,index)=>{
			val.classList.remove('hide')
			val.classList.add('show')
		})	
	}

	_toggleDocker(){
		this.target.forEach((val,index)=>{
			//get display in css
			if(window.getComputedStyle(val).display=='block'){
				this.toggleDockerClosed()
			}else{
				this.toggleDockerOpen()	
			}
		})
	}
}