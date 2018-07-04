
//inject <script> in document.body
//this is needed if you want to import javscript only after
//DOM is loaded
window.bms = window.bms || {}
window.bms.default = window.bms.default || {}
window.bms.default.loadedScript = []

/**
 * @function window.bms.default.lazyLoad
 * @param {array} URL
 * @param {Object} opts 
 * @param {boolean} opts.async - Load in async mode
 * @param {boolean} opts.once - Load JS file only once
 */
export default (src = [], opts = {}) => {
	return new Promise((resolve,reject) => {
		//options
		let opt = opts
		opt.async = opts.async || false
		opt.once = opts.once || false

		for(let file of src){
			//stop if already loaded
			if(opt.once&&(window.bms.default.loadedScript.indexOf(file)!=-1)){
				resolve({code:304,message:'route already loaded'})
				return 0
			}else{
				//script
				let sc=document.createElement('script')
				sc.src=file
				//attributes
				if(opt.async) sc.setAttribute('async','')
				//mark as loaded by lazy loader func
				if(opt.module) sc.setAttribute('type','module')
				sc.setAttribute('lazy-loaded','')
				document.body.appendChild(sc)
				//add to list
				window.bms.default.loadedScript.push(file)
				resolve(sc)
			}
		}
	})	
}
