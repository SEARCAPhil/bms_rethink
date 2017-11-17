export default class{
	constructor(){}

	dump(){ return this }

	render(properties){
		this.properties=properties||{}
		this.properties.description=this.properties.description||'This category has no description. Please add a description to help users to understand what this section is all about'
		this.properties.class=this.properties.class||''
		this.properties.button=this.properties.buttons||[]
		this._template()
		return this.element;
	}

	_template(){
		//create element
		this.element=document.createElement('div');
		let htmlContent=`
					<p><b>${this.properties.name}</b></p>
					<p>${this.properties.description}</p>
					<ul class="breadcrumb">
						<li class="active"><i class="material-icons md-12">arrow_forward</i> </li>
						<li><a href="#">Desktop</a></li>
					</ul>
					<div class="${this.properties.class}">
						<small>`
							//admin buttons
							if(this.properties.buttons.indexOf('update')>=0){
								htmlContent+=`<button class="btn btn-primary btn-xs"><i class="material-icons md-12">edit</i> Update</button>`
							}

							if(this.properties.buttons.indexOf('remove')>=0){
								htmlContent+=`<button class="btn btn-danger btn-xs"><i class="material-icons md-12">remove</i> Remove</button>`;
							}

			htmlContent+=`</small>
					</div>`


		this.element.innerHTML=htmlContent;

        return this;
	}

}