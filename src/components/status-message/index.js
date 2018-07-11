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
 * @function showBiddingReqSent
 */
const showBiddingReqSent = (id) => {
	return {
    id,
    icon: '<i class="material-icons" style="color:#8bc34a;">check_circle</i>',
    message: 'Bidding Request Sent. You Are not able to modify the content of this bidding request.<br/><small class="text-muted"><i class="material-icons md-12">email</i> Waiting for verification</small>',
    actions: ``
  }
}


/**
 * Shows when the request IS FOR APPROVAL
 * 
 * @function showBiddingReqApprove 
 */
const showBiddingReqApprove = (id) => {
  return {
    id,
    icon: '<i class="material-icons" style="color:#ffb80c;">bookmark</i>',
    message: 'This Bidding request is for approval. Make sure you review this request before making any further actions.',
    actions: `<button class="btn btn-danger btn-sm approve-btn" status= "3" data-target="#bidding-modal" data-popup-toggle="open">Approve</button>`
  }
}


/**
 * @function showBiddingReqReturned
 */
const showBiddingReqReturned = (id) => {
    return {
      id,
      icon: '<i class="material-icons" style="color:#ffb80c;">bookmark</i>',
      message: 'This Bidding request was returned. Make sure that all details are complete and follows the bidding request standard procedures',
      actions: ``
    }
}


/**
 * @function showBiddingClosed
 */
const showBiddingClosed = (id) => {
  return {
    id,
    icon: '<i class="material-icons">block</i>',
    message: 'Sorry ! Bidding for this item is already closed <br><small> You are not able to add or modify any content under this item</small>',
    actions: `<a class="nav-link proposal-requirement-dialog-btn"></a>`
  }
}


/**
 * @function showBiddingFailed
 */
const showBiddingFailed = (id) => {
  return {
    id,
    icon: '<i class="material-icons" style="color:#ffb80c;">lock</i>',
    message: 'This bidding request has been closed due to failure of bidding. For more info. please contact the Administrator',
    actions: ``
  }
}


/**
 * @function showBiddingDisapproved
 */
const showBiddingDisapproved = (id) => {
  return {
    id,
    icon: '<i class="material-icons" style="color:#ffb80c;">trash</i>',
    message: '	This Bidding has been disapproved! This bidding request is now closed',
    actions: `<i class="material-icons">lock</i>`
  }
}

/**
 * Shows when the request was APPROVED
 * This is when the current role is GSU
 * 
 * @function showBiddingApproveReadOnly
 */
const showBiddingApproveReadOnly = (id) => {
  return {
    id,
    icon: '<i class="material-icons" style="color:#8BC34A;">check_circle</i>',
    message: 'This Bidding request was approved. You may now invite suppliers to bid on this request',
    actions: ` `
  }
}

export { showBiddingReqSent, showBiddingReqApprove, showBiddingReqReturned, showBiddingClosed, showBiddingFailed, showBiddingDisapproved, showBiddingApproveReadOnly }