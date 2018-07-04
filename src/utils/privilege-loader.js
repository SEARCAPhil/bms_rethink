/*------------------------------------------
 * Privilege
 * Identifies privilege based on given role
 *---------------------------------------------*/

/** 
 * @function window.bms.default.isCBAAsst
 * @returns {boolean}  
 * */
const isCBAAsst = () => {
	return window.localStorage.getItem('role') === 'cba_assistant'
}

/**
 * @function window.bms.default.isAdmin
 * @returns {boolean}
 */
const isAdmin = () => {
	return window.localStorage.getItem('role') === 'admin'
}

/**
 * @function window.bms.default.isGSU
 * @returns {boolean}
 */
const isGSU = () => {
	return window.localStorage.getItem('role') === 'gsu'
}

/**
 * @function window.bms.default.isSupplier
 * @returns {boolean}
 */
const isSupplier = () => {
	return window.localStorage.getItem('role') === 'supplier'
}


/**
 * @function window.bms.default.isStandard
 * @returns {boolean}
 */
const isStandard = () => {
	return window.localStorage.getItem('role') === 'standard'
}

export { isCBAAsst , isAdmin, isGSU, isSupplier, isStandard }