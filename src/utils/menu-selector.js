const PrivilegeLoader = import('./privilege-loader')

/**
 * Add active state to sidebar's main navigation
 * 
 * @function window.bms.default.activeMenu
 * @param {string} id - Children of .main-menu-list-item that contains this id
 * @example
 * // window.bms.default.activeMenu('bidding-menu')
 */
export default class {
	constructor () {

	}
	active (id) {
		document.querySelectorAll('.main-menu-list-item').forEach((el,index)=>{
			if(el.getAttribute('id')==id){
				el.classList.add('active')
			}else{
				el.classList.remove('active')
			}
		})
		// show menu based on privilege
		this.showMenus()
	}
	showMenus () {
		// privilege
		PrivilegeLoader.then(loader => {
			return (loader.isGSU() || loader.isCBAAsst() || loader.isStandard() ) ? showExtendedMenu() : showStandardMenu()	
		})
	}

}

/**
 * @function showStandardMenu 
 */
const showStandardMenu = () => {
	document.querySelectorAll('.inv-menu-list').forEach((el, index) => {
		el.classList.remove('hide')
	})
}

/**
 * @function showExtendedMenu 
 */
const showExtendedMenu = () => {
	document.querySelectorAll('.bids-menu-list').forEach((el, index) => {
		el.classList.remove('hide')
	})

	document.querySelectorAll('.bids-menu-list').forEach((el, index) => {
		el.classList.remove('hide')
	})

	document.querySelectorAll('.inv-menu-list').forEach((el, index) => {
		el.remove()
	})
}


