import ListTemplate from './Templates/List/List'
import ListComp from './Components/List/List'
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

 window.bms.default.spinner=new window.bms.exports.Spinner({
    target:'.default-spinner',
    class:'spinner'
})
window.bms.default.spinner.show()

ListC.getList().then((data)=>{
	window.bms.default.spinner.hide()
	var parsedData=JSON.parse(data)
	var json=parsedData.data
	for(let x=0; x<json.length; x++){
		document.querySelector('.list-section').appendChild(List.render({id:json[x].id,name:json[x].name,description:json[x].description,tagline:json[x].tagline,class:'col-xs-12 col-md-12 col-sm-12 list',established:json[x].established}))
	}	
})

