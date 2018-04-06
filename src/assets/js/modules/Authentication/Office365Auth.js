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

    // loading status
    window.bms.default.spinner = new window.bms.exports.Spinner({
        target:'body',
        class:'spinner'
    })

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
                    let data=JSON.parse(json)
                    if(data.id){
                        // O365 check
                        loginOnPremiseServer (data).then((json) => { 

                            // account not yet verified
                            if (!json.role) {
                                window.location = 'confirmation.html'
                                return 0
                            }
                            
                            window.bms.default.spinner.hide()

                            localStorage.setItem('token', json.token)
                            localStorage.setItem('role', json.role)
                            window.localStorage.setItem('id', data.id)
                            window.localStorage.setItem('givenName', data.displayName)

                            window.location = '../../#/home/'
                           
                        }).catch((err) => {
                            alert('Unable to authenticate. Please try again later.')
                            window.bms.default.spinner.hide()
                            document.querySelector('.btn-office365').removeAttribute('disabled')
                        })
                    }
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
        window.bms.default.spinner.show()
        document.querySelector('.btn-office365').disabled = 'disabled'
        userAgentApplication.loginRedirect(applicationConfig.graphScopes);
    }

    function logout() {
        // Removes all sessions, need to call AAD endpoint to do full logout
        userAgentApplication.logout();
    }

        function loginOnPremiseServer (data) {
            return new Promise((resolve, reject) => {
                const XHR=new window.bms.exports.XHR()
                const payload = {
                    url:`${window.bms.config.network}/auth/`,
                    method:'POST',
                    body: JSON.stringify({
                        data,
                    }),
                }

                XHR.request(payload).then((json) => {

                    const data = JSON.parse(json)
                    try{
                        resolve(data) 
                    }catch(err) {
                        reject(err)
                    }
                   
                })
            })

        }


    


    //console
    console.log("%cUnauthorized Access","color: red; font-size: x-large")
    console.log("%cBidding Management System : You are trying to view the code in console","color: grey")

    document.querySelector('.btn-office365').addEventListener('click',()=>{
     loginRedirect()
    })


})(window,document);
