export default class{
	request(props){
		this.props=props||{};
		//xhr promise
		return new Promise((resolve,reject)=>{
			let xhr=new XMLHttpRequest();
			xhr.open(this.props.method||'GET',this.props.url);
			xhr.onload=()=>{
				if(xhr.status==200&&xhr.readyState==4){
					resolve(xhr.response)
				}else{
					reject(xhr.statusText)
				}
			}

			xhr.onerror=()=>{
				reject(xhr.statusText)
			}

			xhr.send(this.props.body||null)

		})
	}

}