import style from './style'

export default `
<style>${style.toString()}</style>
  <section class="list-sidebar row" style="background:#fff;box-shadow:0 0 5px rgba(200,200,200,.7);min-height: 100vh">     

    <section class="col-12" style="margin-top:50px;">
      <div style="border:1px solid rgba(200,200,200,0.3);margin-bottom:5px;background:#fff;" class="row">
        <div class="btn-group btn-group-sm search-button-group" role="group" aria-label="Basic example">

          <button type="button" class="btn"><i class="material-icons md-18">search</i></button>

          <button type="button" class="btn"><input type="text" placeholder="Search" class="form-control bidding-search-input" id="search" style="margin-bottom:5px;"/></button>
        </div>
      </div>
      <div class="col col-md-12" data-role="none" style="margin-bottom: 5px;padding:8px;">
        <a href="#" class="device-dropdown" data-device-dropdown="list-menu-drop" onclick="event.preventDefault();">
          Filter <i class="material-icons md-18">expand_more</i>
        </a>

        <div class="dropdown-section float-right" id="list-menu-drop" style="left:10px;">
            <ul class="list-group list-group-flush">
                <li class="list-group-item">
                    <span class="menuList allNav">
                        <i class="material-icons md-18 text-muted">inbox</i>
                        <a href="#/bids/all">All</a>
                    </span>
                </li>
                <!--<li class="list-group-item">
                    <span class="menuList blockedNav"><a href="#/bids/open">Open</a></span>
                </li>

                <li class="list-group-item">
                    <span class="menuList blockedNav"><a href="#/bids/closed">Closed</a></span>
                </li>-->

                <li class="list-group-item">
                    <span class="menuList blockedNav">
                        <i class="material-icons md-18 text-muted">drafts</i>
                        <a href="#/bids/drafts">Drafts</a>
                    </span>
                </li>
            <ul>
        </ul></ul></div>

        <span class="menuList suppliers_new_button float-right"><a href="#/bids/forms/registration/steps/1">New <i class="material-icons md-18">add_circle_outline</i></a></span>
        <br> 
      </div>
    </section>	
    <section>
        <!--list-->
        <div class="row list-bidding-section"></div>
        <!--search results -->
        <div class="row list-search-bidding-section hide"></div>
    </section>	
  </section>
<script type="text/javascript" src="assets/js_native/assets/js/routers/bidding/list.js"></script>
`