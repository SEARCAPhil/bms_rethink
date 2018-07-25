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

/**
 * @function showInitial
 */
const showInitial = (id) => {
	return {
    id,
    icon: '<i class="material-icons" style="color:#8bc34a;">mail</i>',
    message: ' Hooray! You are invited to bid on this product. Please review the details before sending a proposal',
    actions: ``
  }
}



export { showInitial }