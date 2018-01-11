export default class{
	constructor(){}

	_template(){
		
		//create element
		this.element=document.createElement('tr');
		this.element.setAttribute('data-list',`${this.properties.id}`)

		let data=JSON.stringify(this.properties)

		//buttons
		let blockButton=`
			<button class="btn btn-sm btn-danger account-block-button" data-item='${this.properties.id}'  data-prop='${data}' data-target="#account-settings-modal" data-popup-toggle="open">BLOCK</button>
		`
		let unblockButton=`
			<button class="btn btn-sm btn-danger account-block-button"  data-item='${this.properties.id}'  data-prop='${data}' data-target="#account-settings-modal" data-popup-toggle="open">UNBLOCK</button>
		`

		let defaultBlockButton = blockButton

		if(this.properties.status == 2) defaultBlockButton = unblockButton

		this.element.innerHTML=`
				<td>${this.properties.username}</td>
				<td>*********</td>
				<td>
					<button class="btn btn-sm btn-dark account-delete-button" data-prop='${data}'  data-target="#account-settings-modal" data-popup-toggle="open">REMOVE</button>
					${defaultBlockButton}
				</td>
			`
        return this;
	}


	render(properties){

		this.properties=properties||{}
		this.properties.class=this.properties.class||''

		//render template
		this._template()
		return this.element;
	}


	
}