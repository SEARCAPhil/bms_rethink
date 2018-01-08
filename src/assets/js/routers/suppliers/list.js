import ListTemplate from '../../modules/Suppliers/Templates/List/List'
import ListComp from '../../modules/Suppliers/Components/List/List'
const appRoute=new window.bms.exports.Router('http://localhost/bms_rethink/www/',true)
window.bms.templates=window.bms.templates||{}
window.bms.templates.suppliersList=ListTemplate

let List=new ListTemplate()
let ListC=new ListComp()

var json=[{
	id:1,
	name:'Southeast Asian Regional Center for Graduate Studies in Research and Agriculture',
	alias:'SEARCA',
	description:'n/a',
	established:2017
},
{
	id:1,
	name:'Southeast Asian Regional Center for Graduate Studies in Research and Agriculture',
	alias:'SEARCA',
	description:'n/a',
	established:2017
},
{
	id:1,
	name:'Southeast Asian Regional Center for Graduate Studies in Research and Agriculture',
	alias:'SEARCA',
	description:'n/a',
	established:2017
}]



appRoute.on({
 	'/*':()=>{
 		//this is required to always treat suppliers as separate route
 		//without this, link will stop working after a few clicks
 	},
	'/suppliers/all':()=>{
		if(window.bms.default.state.supplier.isLoaded){
			window.bms.default.spinner.hide()			
			return 0
		}
		//clear list
		document.querySelector('.list-section').innerHTML=''
		//fetch via AJAX
		ListC.getList().then((data)=>{
			var parsedData=JSON.parse(data)
			var json=parsedData.data
			for(let x=0; x<json.length; x++){
				document.querySelector('.list-section').appendChild(List.render({id:json[x].id,name:json[x].name,description:json[x].description,tagline:json[x].tagline,class:'col-xs-12 col-md-12 col-sm-12 list',established:json[x].established}))
			}

			window.bms.default.spinner.hide()

			//autoclick
			if(json[0]){
				document.querySelector('.list').children[0].click()
				//set state as loaded
				window.bms.default.state.supplier.isLoaded=1
			}	
		})
	}
}).resolve()




