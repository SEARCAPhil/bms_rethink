import style from './style'

export default `
  <style>${style.toString()}</style>
  <header>
    <nav class="navbar navbar-dark navbar-top fixed-top">
      <ul class="nav  ml-auto nav-top-menu" style="display: none;">
        <li class="nav-item" id="about-tab">
          <a class="nav-link active" href="#"><i class="material-icons md-18">dashboard</i></a>
        </li>
        <li class="nav-item" id="products-tab">
          <a class="nav-link" href="#" id="about-tab"><i class="material-icons md-18">shopping_basket</i></a>
        </li>
        <li class="nav-item" id="accounts-tab">
          <a class="nav-link" href="#"><i class="material-icons md-18">account_circle</i></a>
        </li>
        <li class="nav-item" id="logs-tab">
          <a class="nav-link" href="#"><i class="material-icons md-18">history</i></a>
        </li>
        <li class="nav-item" id="settings-tab">
          <a class="nav-link" href="#"><i class="material-icons md-18">settings</i></a>
        </li>
      </ul>
        
      <span class="navbar-brand hamburger mb-0 h1 d-none d-lg-block hidden">
        <span class="burger"></span>
        <span class="burger"></span>
        <span class="burger"></span>  
      </span>
        
      
      <span class="navbar-brand hamburger d-none d-lg-block hidden" style="
          color: #d8d8d8;
          font-size: 14px;">  Bidding Management System
      </span>
        
      <ul class="nav  ml-auto nav-top-menu d-none d-lg-block">
        <li class="nav-item row account-sidebar-btn" id="settings-tab" style="color: #fff;">
            <span class="float-left mr-3" id="givenName-header-section" style="padding-top: 5px;"></span>
            <div class="text-center" style="float: left;width: 35px;height: 35px;border-radius: 50%;margin-right: 10px;overflow: hidden;background: #ffb80c;color:#fff;padding-top: 5px;" id="image-header-section">
              
          </div>
        </li>
      </ul>
                      

      <span class="navbar-brand hamburger mb-0 h1 docker-menu d-lg-none" data-target=".docker">
        <span class="burger"></span>
        <span class="burger"></span>
        <span class="burger"></span>
      </span>
    </nav>
  </header>`