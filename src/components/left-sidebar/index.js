import style from './style'

export default `
  <style>${style.toString()}</style>
  <div class="content container-fluid" style="height: 1080px;background: none;padding-top:40px;">
    <menu class="col col-md-12 text-left">
      <ul class="list-unstyled main-menu main-menu-list">
        <li data-status="home" 
            class="main-menu-list-item suppliers_main_menu" 
            id="home_menu" 
            data-menu="main-menu-list-item" 
            onclick="window.location.hash='#/home/'"> <i class="material-icons md-18" style="width: 24px;">home</i> Home
        </li>

        <li data-status="bids" 
            class="main-menu-list-item bids-menu-list hide" 
            id="bids-menu-list"
            data-menu="main-menu-list-item" 
            data-role="none" onclick="window.location.hash='#/bids/all'"> Bidding request <i class="material-icons md-18 float-right text-muted" style="width: 24px;">expand_more</i>
        </li>

        <li data-status="all" 
            class="main-menu-list-item bids-menu-list sub hide" 
            data-menu="main-menu-list-item" 
            id="bids-menu-list-all"
            data-role="none" onclick="window.location.hash='#/bids/all'"> <i class="material-icons md-18" style="width: 24px;">inbox</i> All
        </li>

        <li data-status="drafts" 
            class="main-menu-list-item bids-menu-list sub hide" 
            id="bids-menu-list-drafts"
            data-menu="main-menu-list-item" 
            data-role="none" onclick="window.location.hash='#/bids/drafts'"> <i class="material-icons md-18" style="width: 24px;">drafts</i> Drafts
        </li>

        <li
            class="main-menu-list-item bids-menu-list sub hide" 
            id="bids-menu-list-new"
            data-menu="main-menu-list-item" 
            data-role="none" onclick="window.location.hash='#/bids/forms/registration/steps/1'"> <i class="material-icons md-18" style="width: 24px;">add_circle</i> New
        </li>

        <li
            class="main-menu-list-item bids-menu-list sub hide" 
            id="bids-menu-list-reports"
            data-menu="main-menu-list-item" 
            data-role="none" onclick="window.location.hash='#/bids/reports/'"> <i class="material-icons md-18" style="width: 24px;">trending_up</i> Reports
        </li>

        <li data-status="inv" 
            class="main-menu-list-item inv-menu-list hide" 
            id="inv-menu-list"
            data-menu="main-menu-list-item" 
            data-role="none" onclick="window.location.hash='#/inv/all'">
                <i class="material-icons md-18" style="width: 24px;">mail</i> 
                Invitations
        </li>

        <br/>
        <li data-status="inv" 
            class="bids-menu-list hide" 
            data-menu="main-menu-list-item" 
            data-role="none">Feedback Hub <i class="material-icons md-18 float-right text-muted" style="width: 24px;">expand_more</i>
        </li>

        <li data-status="inv" 
          class="main-menu-list-item feedback-menu-list bids-menu-list sub hide" 
          id="feedback-menu-list"
          data-menu="main-menu-list-item" 
          data-role="none" onclick="window.location.hash='#/feedback/form'">
              <i class="material-icons md-18" style="width: 24px;">feedback</i> 
              Submit your feedback/ Comments/ Suggestions here
        </li>
      </ul>
    </menu>

    <menu class="col col-md-12">
      <ul class="list-unstyled main-menu">
        <li data-role="none">
          <a href="#/logout" 
              style="color:rgb(255,184,12);" 
              data-ajax="false" 
              class="ui-link"><i class="material-icons" style="width: 24px;">keyboard_backspace</i> Sign-out  
          </a>
        </li>
      </ul>
    </menu>
  </div>   
`