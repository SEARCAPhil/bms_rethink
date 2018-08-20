/** 
 * Load account settings in global
 * 
 * @function window.bms.default.loadProfile
 * @returns {Object} window.bms.account
 */
export default () => {
  // save to global settings
  window.bms = window.bms || {}
	window.bms.account = {
		name:  window.localStorage.getItem('givenName') || 'Guest Account' ,
		alias: (window.localStorage.getItem('givenName') || '   ').substr(0,2).toUpperCase(),
		department: window.localStorage.getItem('department'),
	}
}