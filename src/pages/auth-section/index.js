import style from './style'

export default `
<style>
  .doodle-section {
    height: 50%;
    width: 100%;
    background: url('assets/img/doodle.png') no-repeat;
    overflow: hidden;
    position: absolute;
    z-index: 0;
    bottom: 0%;
  }
  .sub-banner-deco {
    position: absolute;
    height: 20%;
    width: 100%;
    background: url('assets/img/sub-banner-deco.png') no-repeat;
    background-size: cover;
    overflow: hidden;
    bottom: 0;
  }
</style>
<style>${style.toString()}</style>
<article class="main-login row d-flex">
  <section class="col col-12 col-lg-7 main-login-banner">
    <div class="container col-10 offset-1 offset-lg-1 offset-sm-2 offset-xs-1 main-login-banner-text"> 
      <h2>Bidding Management System</h2>
      <p class="text-muted">Compare supplier's price <span class="green">easier</span> , <span class="green">faster</span> and <span class="green">better</span> than before!<br/> 
      Be the first to use the new and advanced bidding management system</p><br/><br/><br/><br/><br/>
      <h5 class="text-muted">&emsp;Sign-in with</h5>
      <button class="btn btn-lg btn-dark btn-submit go-to-app-btn" type="button" style="color:#fff;background:#ffc107;" onclick="window.location='cauth.html'">Company Account</button>
      &emsp;<button class="btn btn-office365 btn-lg btn-dark btn-submit go-to-app-btn" type="button" style="color:#fff;background:#ff0763;">Login with Office365</button>
    </div>
    <div class="main-login-backdrop"></div>
    <div class="doodle-section"></div>
  </section>

  <section class="col col-lg-5 sub-login-banner">
    <div class="sub-banner-deco"></div>
      <div class="col-lg-10 offset-lg-1">
        <img src="assets/img/searca-new.png" width="150px">
        <p>What makes it a powerful  system for handling <br/>your records and documents?</p>
        <br/><br/>

        <div class="media">
          <div class="media-left">
            <img src="assets/img/checked-green.png" width="50px">
          </div>
          <div class="media-body">
            <h5 class="media-heading">Easy to use</h5>
            <p><small>Simple but progressive design</small><hr/></p>
          </div>
          <hr/>
        </div>

        <div class="media">
          <div class="media-left">
            <img src="assets/img/checked-green.png" width="50px">
          </div>
          <div class="media-body">
            <h5 class="media-heading">Safe and secured</h5>
            <p><small>Stored your data in the cloud with security and privacy. By using your Office365 account, you gain 1 more extra security layer to protect your files against hackers and viruses  </small><hr/></p>
          </div>
        </div>

        <div class="media">
          <div class="media-left">
          <img src="assets/img/checked-green.png" width="50px">
          </div>
          <div class="media-body">
              <h5 class="media-heading">Accessible everywhere</h5>
              <p><small>Retrieve your files anytime and everytime in the world!</small><hr/></p>
          </div>
        </div>

        <br/>
        <br/>
        <p>
          <small>By signing in to BMS you are agree to <span class="text-success">Users License agreement</span> and <span class="text-success">Data policy</span> settings of SEARCA</small>
        </p>
      </div> 
    </div>
  </section>

<!--end content-->
</artice>

<script type="text/javascript" src="../node_modules/msal/dist/msal.js"></script>
<script type="module" src="pages/auth-section/o365.js"></script>`