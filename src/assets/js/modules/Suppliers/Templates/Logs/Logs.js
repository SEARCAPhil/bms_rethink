export default class{
	constructor(){}

	_template(){
		//change badge color depending on the event type
		let badgeClass='danger'

		if(this.properties.event=="account"){
			badgeClass="info"
		}

		//create element
		this.element=document.createElement('div');
		
		//shorten description
		this.properties.description=this.properties.description.length>200?this.properties.description.substr(0,200)+'. . .':this.properties.description;

		//set attribute
		this.element.setAttribute('class',`${this.properties.class}`)
		this.element.setAttribute('data-list',`${this.properties.id}`)
		this.element.innerHTML=`
			<p class="logs"><span class="text-danger">[${this.properties.date}]</span> <span class="text-muted">${this.properties.description}</span> <span class="badge badge-${badgeClass}">${this.properties.event}</span></p>`

        return this;
	}

	render(properties){
		this.properties=properties||{}
		this.properties.description=this.properties.description||''
		this.properties.class=this.properties.class||''

		//render template
		this._template()
		return this.element;
	}
	
}