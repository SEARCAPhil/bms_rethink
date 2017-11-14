export default class{
	constructor(conf={}){
		this.conf=conf||{}
		this.conf.root=conf.root||false
		if(!this.conf.root){
			this.Navigo=new window.bms.exports.Router()
		}else{
			this.Navigo=new window.bms.exports.Router(this.conf.root,true)
		}
		
		this.XHR=new window.bms.exports.XHR()
		this.XHR.conf=conf
		this.XHR.conf.abort=conf.abort||false
		this.abort=()=>{}
		this.routed=[]
		this.current=null
	}
	_display(display,name=[]){

		for(let n of name){
			document.querySelectorAll(`route[name="${n}"]`).forEach((el,index)=>{
				if(display=="show"&&el.children[0]){
					el.children[0].style.display="block"
				} 

				if(display=="hide"&&el.children[0]){
					el.children[0].style.display="none"
					
				} 
			})	
		}
	}
	is(name){
		return this.current==name
	}
	route(name,opt={}){
		//active state
		this.current=name
		//filet in window
		if(opt.window&&(window.bms.default.routed.indexOf(name)!=-1)){
			this.show([name])
			return new Promise((res,rej)=>{rej({code:304,message:'route already loaded in window'})})
		}else{
			//inject to window
			window.bms.default.routed.push(name)
		}
		//filter routed per class
		if(opt.once&&(this.routed.indexOf(name)!=-1)){
			this.show([name])
			return new Promise((res,rej)=>{rej({code:304,message:'route already loaded'})})
		}else{
			//mark as routed
			this.routed.push(name)

		}

		//make abort() available to AppRoute namespace
		this.abort=this.XHR.abort||(()=>{})
		//abort previous request
		if(this.XHR.conf.abort){
			 if(typeof this.XHR.abort!='undefined'){
			 	this.XHR.abort() 
			 } 	 	
		}

		let r=document.querySelectorAll(`route[name="${name}"]`)
		return new Promise((resolve,reject)=>{
			r.forEach((el,index)=>{
				this.show([name])
				//XHR	
				this.XHR.request({method:'GET',url:el.getAttribute('page')}).then(res=>{
					el.innerHTML=res
					this.show([name])
					window.bms.default.scriptLoader(el)
					resolve(this)
				})
			})
		})

	}

	reset(name=[]){
		for(let n of name){
			//remove from list of loaded routes
			var r=this.routed.indexOf(n)
			if(r!=-1){
				this.routed.splice(r,1)
				console.log(this.routed)
				console.log(r)	
			}
		}
		
	}

	show(name){
		this._display('show',name)
	}
	hide(name){
		this._display('hide',name)
	}

}

