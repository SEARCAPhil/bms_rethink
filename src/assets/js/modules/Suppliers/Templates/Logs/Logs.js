export default class{
	constructor(){}

	_template(){
		let badgeClass='danger'

		if(this.properties.event=="account"){
			badgeClass="info"
		}

		//create element
		this.element=document.createElement('div');

		//set HTML content
		//this.element_content=document.createElement('div');
		
		//shorten description
		this.properties.description=this.properties.description.length>200?this.properties.description.substr(0,200)+'. . .':this.properties.description;

		//set attribute
		this.element.setAttribute('class',`${this.properties.class}`)
		this.element.setAttribute('data-list',`${this.properties.id}`)
		this.element.innerHTML=`
			<p class="logs"><span class="text-danger">[${this.properties.date}]</span> <span class="text-muted">${this.properties.description}</span> <span class="badge badge-${badgeClass}">${this.properties.event}</span></p>`

        //this.element.appendChild(this.element_content)

        return this;
	}

	_bind(){

		//save callback to windows
		window.bms=window.bms||{}
		window.bms.callback=window.bms.callback||{}

		for(let event in this.properties.events){
			this.element.addEventListener(event,this.properties.events[event])
		}
		
	}


	render(properties){
		this.properties=properties||{}
		this.properties.description=this.properties.description||''
		this.properties.class=this.properties.class||''

		//render template
		this._template()
		this._bind();
		return this.element;
	}

	dump(){ return this	}
	
}