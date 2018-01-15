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
		this.element.classList.add('category')
		this.element.setAttribute('data-list',this.properties.id)
		this.element.setAttribute('data-json',JSON.stringify(this.properties))
		let htmlContent=`
					<p><b><a href="#">${this.properties.name}</a></b></p>
					<p class="category-description-${this.properties.id}">${this.properties.description}</p>
					<!--<ul class="breadcrumb">
						<li class="active"><i class="material-icons md-12">arrow_forward</i> </li>
						<li><a href="#">Desktop</a></li>
					</ul>-->
					<div class="${this.properties.class}">
						<small class="float-right">`
							//admin buttons
							if(this.properties.buttons.indexOf('update')>=0){
								htmlContent+=`<button class="btn btn-light btn-sm product-update-modal-button" data-category-id="${this.properties.id}"><i class="material-icons md-12">edit</i> Update</button> `
							}

							if(this.properties.buttons.indexOf('remove')>=0){
								htmlContent+=`<button class="btn btn-danger btn-sm product-delete-modal-button"  data-target="#product-modal" data-popup-toggle="open" data-category-id="${this.properties.id}"><i class="material-icons md-12">remove</i> Remove</button> `;
							}

			htmlContent+=`</small>
						<div class="row"><hr/></div>
					</div>`


		this.element.innerHTML=htmlContent;

        return this;
	}

}