/*----------------------------------------------------------------------------------------------------------
| MSAL script
| This script is for authenticating user with microsoft AD and office365 ADVV2
|
| REQUIREMENTS:
| MSAL                  MSAL.js  [https://github.com/AzureAD/microsoft-authentication-library-for-js]
|
| NOTE: 
| Running MSAL inside es6 class intermitently triggers token renewal error
| As a work around, MSAL object was created as per official repo's example. Please see github link above
|----------------------------------------------------------------------------------------------------------*/

(function(window,document,undefined){
    "use strict";

      if (document.URL.indexOf( 'http://' ) === -1  && document.URL.indexOf( 'https://' ) === -1) {
       delete window.open;  // This restores the default browser
    }
        var applicationConfig = {
            clientID: 'dd7a26d3-c6ef-4aba-8ed4-b79688983849',
            graphEndpoint: "https://graph.microsoft.com/beta/me/",
            graphScopes: ["user.read"]
        };

        const XHR=new window.bms.exports.XHR()

        var logger = new Msal.Logger(loggerCallback, { level: Msal.LogLevel.Verbose });
        function loggerCallback(logLevel, message, piiEnabled) {
            console.log(message);
        }
        var userAgentApplication = new Msal.UserAgentApplication(applicationConfig.clientID, null, authCallback, { cacheLocation: 'localStorage', logger: logger });// cacheLocation defaults to sessionStorage if not set in the constructor
        
        function authCallback(errorDesc, token, error, tokenType) {
            //This function is called after loginRedirect and acquireTokenRedirect. Use tokenType to determine context. 
            //For loginRedirect, tokenType = "id_token". For acquireTokenRedirect, tokenType:"access_token".
            if (token) {
                userAgentApplication.acquireTokenSilent(applicationConfig.graphScopes).then(function (accessToken) {
                    // Change button to Sign Out
                    XHR.request({url:'https://graph.microsoft.com/beta/me/',method:'GET',headers:{'Authorization':'Bearer '+accessToken}}).then(json=>{
                      var data=JSON.parse(json)
                      console.log(data)
                    })
                }, function (error) {
                    console.log(error);
                    userAgentApplication.acquireTokenPopup(applicationConfig.graphScopes).then(function (accessToken) {
                        console.log(userAgentApplication.getUser())
                    }, function (error) {
                        console.log(error);
                    });
                });
            }
            else if (errorDesc || error) {
                console.log(error + ':' + errorDesc);
            }
        }


        function loginRedirect() {
            userAgentApplication.loginRedirect(applicationConfig.graphScopes);
        }
        function logout() {
            // Removes all sessions, need to call AAD endpoint to do full logout
            userAgentApplication.logout();
        }


    


    //console
    console.log("%cUnauthorized Access","color: red; font-size: x-large")
    console.log("%cBidding Management System : You are trying to view the code in console","color: grey")

    document.querySelector('.btn-office365').addEventListener('click',()=>{
     loginRedirect()
    })


})(window,document);
