/**
 *  Bidding Status Code
 *  Please see https://github.com/SEARCAPhil/bms_api/blob/develop/docs/bidding/status.md
 * 
 *  0  Draft - Newly created bidding request 
 *  1  Sent - Bidding request was received by CBA Assts 
 *  2  Returned - Bidding request was returned to the creator for modifications 
 *  3  Approved - Bidding is on progress 
 *  4  Deleted - Removed from the system (soft delete) 
 *  5  Closed - Bidding request is successful 
 *  6  Failed - Bidding failed for whatever reason
 */
import awardedStyle from './awarded_style'

/**
 * Awarded
 * For all accounts
 * 
 * @function showAwardedStatus
 */
const showAwardedStatus = (id) => {
  return {
    id,
    icon: `<style>${awardedStyle.toString()}</style><img src="assets/img/medal.png" width="60px">`,
    message: ' <p class="p-3">This has been awarded. Please review before making any changes.</p>',
    actions: ` `
  }
}

const showModifiedStatus = (id) => {
  return {
    id,
    icon: `<style>${awardedStyle.toString()}</style> <i class="material-icons md-36">refresh</i>`,
    message: ' <p class="p-3">This bidding requirement has been modified. Please reload this page to see changes</p>',
    actions: `<a href="#" onclick="event.preventDefault();window.location.reload();"> reload </a> `
  }
}

export { showAwardedStatus, showModifiedStatus }