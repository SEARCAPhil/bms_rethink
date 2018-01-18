import Categories from '../../../../modules/Suppliers/Components/Products/Categories/Categories.js'
import Products from '../../../../modules/Suppliers/Components/Products/Products.js'
import CatTemplate from '../../../../modules/Suppliers/Templates/Products/Categories/Categories.js'
import CatUtilities from '../../../../modules/Suppliers/Util/Forms/Products/Category.js'
import PopupES from '../../../../Components/PopupES/PopupES.js'
import ProdUtilities from '../../../../modules/Suppliers/Util/Forms/Products/Products.js'


//window.bms.exports.PopupEs=PopupEs
const XHR=new window.bms.exports.XHR()
const appRoute=new window.bms.exports.Router('http://localhost/bms_rethink/www/',true)
const CatUtil = new CatUtilities()


let Cat=new Categories()
let Prod=new Products()
const ProdUtil=new ProdUtilities()
let PopupInstance



 appRoute.on({
 	'/*':()=>{
 		//required
 	},
	'/suppliers/:id/products/tabs/categories':(params)=>{
		window.bms.default.spinner.show()
		window.bms.default.changeDisplay(['route[name="/suppliers/products"]'],'block')
		window.bms.default.changeDisplay(['route[name="/suppliers/about"]','route[name="/suppliers/settings"]','route[name="/suppliers/logs"]','route[name="/suppliers/logs"]','route[name="/suppliers/accounts"]'],'none')
		
		ProdUtil.loadProductSection(params).then(()=>{
			window.bms.default.changeDisplay(['.category-container'],'block')
			window.bms.default.changeDisplay(['.product-profile-container','.product-container'],'none')

			document.querySelector('.product-main-tabs > ul > li > a.categories').classList.add('active')
			document.querySelector('.product-main-tabs > ul > li > a.all').classList.remove('active')

			//load menu
			CatUtil.loadCategorySection()
			CatUtil.loadCategories(params.id).then(e=>{
				window.bms.default.spinner.hide()
				PopupInstance=new PopupES()
				CatUtil.bindDeleteModalButton()
				CatUtil.bindUpdateModalButton()
			})
		
		})
	}
}).resolve()

