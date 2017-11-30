import Authentication from './Util/Email/OrgChecker.js'


let Auth=new Authentication()

function listenOnUsernameChange(e){ 
	var el=document.getElementById('organization');
	if(el.value.length<1) return false
		

	//redirect to o365 Oauth page
	var isSearca=Auth.checkCorporateEmailAddress({domain:'searca',email:el.value})
	if(isSearca){
	 	this.setAttribute('disabled','disabled')
		setTimeout(()=>{window.location=window.location.href.substr(0,window.location.href.lastIndexOf('/'))+'/o365.html'},600)
	}

	//show login form
	if(!isSearca){
		document.querySelector('.auth-org').style.display='none'
		document.querySelector('.auth-default').style.display='block'	
	}
	


}

window.addEventListener('DOMContentLoaded',()=>{
	document.querySelector('#loginOrgButton').addEventListener('click',listenOnUsernameChange,false)
})