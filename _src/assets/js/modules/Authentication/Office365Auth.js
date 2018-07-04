import AuthenticationContext from 'adal-angular';
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
    // XHR
    const XHR = new window.bms.exports.XHR()
    // phonegap settings
    if (document.URL.indexOf( 'http://' ) === -1  && document.URL.indexOf( 'https://' ) === -1) {
       delete window.open;  // This restores the default browser
    }

    // loading status
    window.bms.default.spinner = new window.bms.exports.Spinner({
        target:'body',
        class:'spinner'
    })

    // adal
    window.adalConfig  = {
        instance: 'https://login.microsoftonline.com/', 
        tenant: 'common', //COMMON OR YOUR TENANT ID
        clientId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', //This is your client ID
        redirectUri: `http://localhost/bms_rethink/www/pages/`, //This is your redirect URI
        cacheLocation: 'localStorage',
        callback: userSignedIn,
        popUp: true,
        endpoints : {"https://graph.microsoft.com": "https://graph.microsoft.com"},
    }
    // adal global instance
    window.AuthenticationContext = AuthenticationContext

    // adal error
    const authError = () => {
        alert('Unable to authenticate. Please try again later.')
    }

    const loginOnPremiseServer = (data) => {
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

    // authenticate to remote server
    const loginOnPremise = (data) => {
        loginOnPremiseServer (data).then((json) => { 
            // account not yet verified
            if (!json.role) {
                window.location = 'authentication/confirmation.html'
                return 0
            }
            
            window.bms.default.spinner.hide()

            localStorage.setItem('token', json.token)
            localStorage.setItem('role', json.role)
            localStorage.setItem('username', data.mail)
            window.localStorage.setItem('id', data.id)
            window.localStorage.setItem('givenName', data.displayName)
            window.localStorage.setItem('department', data.department)
            window.localStorage.setItem('position', data.jobTitle)
            window.location = '../#/home/'
           
        }).catch((err) => {
            alert('Unable to authenticate. Please try again later.')
            window.bms.default.spinner.hide()
            authError()
            document.querySelector('.btn-office365').removeAttribute('disabled')
        })

    }

    // get msgraph
    const getGraph = (token)  => {
        fetch('https://graph.microsoft.com/beta/me/',{ 
            headers:{'Authorization':'Bearer '+token}, 
            method: 'GET'}
        ).then(response => response.json()).catch((err) => {
            authError()
        }).then(data => {
            // auth to onpremise
            if(data.id) { 
                loginOnPremise(data)
            }
        })
    }

    // adal callback
    function userSignedIn(err, token) {
        window.bms.default.spinner.show()
        if (!err) {
            window.ADAL.acquireToken("https://graph.microsoft.com", function (error, token) {
                if(token.length) {
                    getGraph(token)
                } else {
                    authError()
                }
            })
        }
    }

    // adal instance
    window.ADAL = new  window.AuthenticationContext(window.adalConfig);
    window.ADAL.handleWindowCallback()

    //console
    console.log("%cUnauthorized Access","color: red; font-size: x-large")
    console.log("%cBidding Management System : You are trying to view the code in console","color: grey")

    document.querySelector('.btn-office365').addEventListener('click', (e) => {
        e.target.disabled = 'disabled'
        window.ADAL.login()
    })


})(window,document);
