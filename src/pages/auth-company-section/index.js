import style from './style'


export default `
<style>${style.toString()}</style>    
<main class="auth-main container">
  <section class="col-xs-12 col-lg-4 offset-lg-4 col-md-8 offset-md-2 col-sm-10 offset-sm-1">
    <div class="col col-md-12 text-center"><img src="./assets/img/searca-new.png" width="60%"></div>
    <div class="col col-md-12">
      <center><br/>
        <h3 style="padding-right: 0px !important;"> Sign-in </h3>
        <small><p href="#" class="text-muted"></p>SEARCA's Bidding Management System</small><br/>
      </center>
    </div>
  </section>

  <section class="col-xs-12 col-lg-4 offset-lg-4 col-md-8 offset-md-2 col-sm-10 offset-sm-1">
    <form name="login" onsubmit="return false;">
      <center>
        <p><br/>
            <input type="text" placeholder="Username" id="username" class="text-center form-control" autofocus>
        </p>
        <p>
            <input type="password" placeholder="Password" id="password" class="text-center form-control hide">
        </p>
        <p class="login-status"></p>
        <small>
          <span id="auth-status"></span>
          <center><small><p>By signing to BMS you agree to <a href="#">Users License agreement</a> and<br><a href="#">Data policy</a> settings of SEARCA</p></small></center>
          <p>
              <button class="btn btn-dark btn-block" id="loginBtn">Sign-In</button>
              <br/><br><br/>
              <p>
                  <small class="text-muted">
                      &copy;<a href="www.searca.org">www.searca.org</a> 
                      v2.0 
                  </small>
              </p>
          </p>
        </small>
      </center>
    </form>
  </section>
</main>
<script type="module" src="pages/auth-company-section/auth.js"></script>`