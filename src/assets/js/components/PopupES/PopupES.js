/**
 Copyright (c) 2017 John Kenneth Abella

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */
export default class{
	constructor(options){
		//options
		this.options=options||{}
		this.options.selectors=this.options.selectors||{}
		this.options.selectors.popup=this.options.selectors.popup||"data-popup"
		this.targetSelector=this.options.selectors.target||"data-target"
		this.toggleSelector=this.options.selectors.toggle||"data-popup-toggle"
		//selectors
		this.selector=`[${this.options.selectors.popup}]`
		this.openSelector=`[${this.toggleSelector}='open']`
		this.closeSelector=`[${this.toggleSelector}='close']`
		//funtions
		this._findPopups(this.selector)
		this._findPopupHandler(this.openSelector)
	}
	_setDisplayAttr(el,display=true){
		return display?el.setAttribute('open',''):el.removeAttribute('open')		
	}
	_setIndex(el,i){
		//change the zIndex property everytime you open the popup
		//this ensures that popup will always stay at the top or bottom depending on the value of i 
		let date=new Date()
		return el.style.zIndex=(typeof i=='number')?1:(parseInt((window.getComputedStyle(el,null).getPropertyValue('z-index')))||1)+(date.getMinutes()+date.getSeconds())
	}
	_findPopups(selector){
		return new Promise((resolve,reject)=>{

			document.querySelectorAll(selector).forEach((el,index)=>{
				//Ignore already defined popups
				if(el.popup) return resolve(this)

				el.show=(e)=>{
						//prevent undefined event when calling .show() in console
						if(e) e.preventDefault()
						this._setDisplayAttr(el,1)
						//set z-index
						this._setIndex(el)
				}	
								
				el.close=()=>{
					this._setDisplayAttr(el,0)
					this._setIndex(el,1)
				}

				//prevent attaching event listeners to the same target
				el.popup=true
				//handle close event
				this._findPopupCloseHandler(`${selector} ${this.closeSelector}`)

				resolve(this)
			})
		})
	}
	_findPopupHandler(selector){
		document.querySelectorAll(selector).forEach((el,index)=>{
			let target=el.getAttribute(this.targetSelector)
			this._findTargetPopup(target).then((e)=>{
				el.removeEventListener('click',e.show)
				el.addEventListener('click',e.show)
			})
		})
	}
	_findPopupCloseHandler(selector){
		document.querySelectorAll(selector).forEach((el,val)=>{
			el.removeEventListener('click',this._closeParentPopup)
			el.addEventListener('click',this._closeParentPopup)
		})
	}
	_findTargetPopup(target){
		return new Promise((resolve,reject)=>{
			document.querySelectorAll(target).forEach((el,index)=>{
				resolve(el)	
			})
		})
	}

	_closeParentPopup(e){
		e.preventDefault()
		//allow close button to be placed inside OR outside .content 
		if(this.offsetParent.getAttribute('data-popup')!=null){
			return this.offsetParent.close()	
		}

		return this.offsetParent.offsetParent.close()
	}

	closeAll(){
		return new Promise((resolve,reject)=>{
		document.querySelectorAll(this.selector).forEach((el,index)=>{
				el.close()
				setTimeout(()=>{
					resolve(this)
				},300)
			})
		})	
	}
	close(selectors=[]){
		return new Promise((resolve,reject)=>{
			selectors.forEach((val,index)=>{
				document.querySelectorAll(val).forEach((el,i)=>{
					el.close()
					resolve(this)
				})
			})
		})

	}

}