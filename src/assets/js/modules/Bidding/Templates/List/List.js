export default class{
	constructor(){}

	_template(){
		
		//create element
		this.element=document.createElement('div');

		//set HTML content
		//this.element_content=document.createElement('div');
		
		//shorten description
		this.properties.description=this.properties.description.length>200?this.properties.description.substr(0,200)+'. . .':this.properties.description;

		//set attribute
		this.element.setAttribute('class',`${this.properties.class}`+` ${this.properties.status}`)
		this.element.setAttribute('data-list',`${this.properties.id}`)
		this.element.innerHTML=`
			<a href="#/bids/${this.properties.id}/info">
				<h6 class="suppliers-list-item-header">#${this.properties.id}</h6>
	            <!--<small>
	           		<p style="font-size:smaller;">${this.properties.description}</p>
	            </small>-->
	            <small>
	           		<p style="font-size:smaller;" class="text-muted">
	           			${this.properties.profile_name} <br/>
	           			${this.properties.date_created}
	           		</p>
	            </small>
	        </a>`
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
		this.properties.profile_name = this.properties.profile_name || ''
		this.properties.profile_date_created = this.properties.date_created || ''

		//render template
		this._template()
		this._bind();
		return this.element;
	}

	dump(){ return this	}
	
}