export default class{
	constructor(){}

	checkCorporateEmailAddress(options){
		this.domain=options.domain
		this.email=options.email
		this.offset=this.email.length-this.domain.length
		return ((`${this.email.substr(this.offset,this.domain.length)}`)===this.domain)

	}

	checkOrgFromServer(options){
		this.org=options.org
			
	}
}