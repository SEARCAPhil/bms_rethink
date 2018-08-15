export default class{
  constructor(){}
  
	checkCorporateEmailAddress (opt) {
		this.domain = opt.domain
		this.email = opt.email
		this.offset = this.email.length - this.domain.length
		return ((`${this.email.substr(this.offset,this.domain.length)}`) === this.domain)

	}

	checkOrgFromServer(opt){
		this.org = opt.org		
	}
}