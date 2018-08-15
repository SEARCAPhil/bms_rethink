import style from './style'


export default `
<style>${style.toString()}</style>    
<div class="backdrop"></div>
<div class="backdrop-header"></div>
<div class="backdrop-content text-center">   
    <h1><span style="border-bottom: 2px solid #dc3545;">SEARCA</span></h1>
    <h1><br/>Bidding Management System</h1>
    <div class="col-12 col-lg-6 offset-lg-3" style="padding: 100px;padding-top: 10px;">
        <br/>
        <p style="color:#cacaca;">
           Compare supplier's price easier , faster and better than before! Be the first to use the new and advanced bidding management system        
        </p>
        <p> 
            <br/> 
            <h4>Sign-in with</h4>

            <p>
                <button class="btn btn-lg btn-dark btn-submit go-to-app-btn" type="button" style="color:rgb(255,255,255);background: #ffc107;" onclick="window.location='authentication/'">Company Account</button>
            </p>

            <p>OR</p>
             <button class="btn btn-office365 btn-lg btn-dark btn-submit go-to-app-btn" type="button" style="color:rgb(255,255,255);background: #ff0763;">Login with Office365</button>
        </p>
    </div>
</div>

<div style="margin-top: 8vh;">
    <div class="col-xs-12 col-lg-10 offset-lg-1 col-md-8 offset-md-2 col-sm-10 offset-sm-1 text-center">
      <img src="./assets/img/laptop.png" width="100%">
    </div>
    <form method="POST" data-ajax="false" onsubmit="return false;"> 
        <div class="col-xs-12 col-lg-4 offset-lg-4 col-md-8 offset-md-2 col-sm-10 offset-sm-1">
            <div class="col-md-12 auth-error" style="margin-top:50px;"></div>
                <center style="margin-bottom: 20%;">  
                    
                    <small class="col-xs-10 col-xs-offset-1" style="font-size: xx-small;">
                        <p><a href="#" class="text-muted ui-link">© 2017 Information Technology Services Unit</a></p>
                    </small>
                </center>
            <!--end submit button-->
            <div style="clear: both;"></div>
        </div>
    </form>
</div>
<script type="text/javascript" src="../node_modules/msal/dist/msal.js"></script>
<script type="module" src="pages/auth-section/o365.js"></script>`