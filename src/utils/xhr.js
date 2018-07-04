export default class  {
	request(props){
		this.props  = props ||  {};
		this.xhr  = new XMLHttpRequest();
		//xhr promise
		return new Promise((resolve,reject) =>  {
			this.xhr.open(this.props.method ||  'GET',this.props.url)
			//request headers
			if(this.props.headers){
				for(let header in this.props.headers) {
					this.xhr.setRequestHeader(header, this.props.headers[header])
				}
			}
      // loaded
			this.xhr.onload=()=>{
				if(this.xhr.status  ==  200 &&  this.xhr.readyState  ==  4)  {
				  resolve(this.xhr.response)
				}else{
					reject(this.xhr.statusText)
				}
			}
      // error
			this.xhr.onerror  = ()  =>  {
				reject(this.xhr.statusText)
			}

			this.abort  = ()  =>  {
				this.xhr.abort()
			}

			this.xhr.send(this.props.body ||  null)

		})
	}
}