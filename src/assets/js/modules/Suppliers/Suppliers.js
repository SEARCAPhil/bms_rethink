import ListTemplate from './Templates/List/List'
import ListComp from './Components/List/List'
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




