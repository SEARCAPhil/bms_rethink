import AuthenticationContext from 'adal-angular'
const XHR = import('../../utils/xhr')

// initializ settings
const init = () => {
   // phonegap settings
    if (document.URL.indexOf( 'http://' ) === -1  && document.URL.indexOf( 'https://' ) === -1) {
      delete window.open;  // This restores the default browser
    }
}

(async () => {
  const AdalConfig = await import('../../config/adal')
  const ApiConfig = await import('../../config/api') 

  // adal error
  const authError = () => {
    alert('Unable to authenticate. Please try again later.')
  }

  // adal callback
  const userSignedIn = (err, token) => { 
    //window.bms.default.spinner.show()
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


  
const loginOnPremiseServer = (data) => { 
  return new Promise((resolve, reject) => {
       XHR.then(res => {
        const XHReq = new res.default()
        const payload = {
          url:`${ApiConfig.default.url}/auth/`,
          method:'POST',
          body: JSON.stringify({
              data,
          }),
        }

        XHReq.request(payload).then((json) => {
          const data = JSON.parse(json)
          try{
              resolve(data) 
          }catch(err) {
              reject(err)
          } 
        })
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
      
     // window.bms.default.spinner.hide()
      localStorage.setItem('token', json.token)
      localStorage.setItem('role', json.role)
      localStorage.setItem('username', data.mail)
      window.localStorage.setItem('id', data.id)
      window.localStorage.setItem('givenName', data.displayName)
      window.localStorage.setItem('department', data.department)
      window.localStorage.setItem('position', data.jobTitle)
      window.localStorage.setItem('image', data.image)
      window.location = './#/home/'
     
  }).catch((err) => {
     // window.bms.default.spinner.hide()
      authError()
      document.querySelector('.btn-office365').removeAttribute('disabled')
      console.log(err)
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
        
        getImage(token).then(res => { 
          res.blob().then(blob => {
          // reader
          let reader = new FileReader();
          reader.readAsDataURL(blob); 
          reader.onloadend = function() {
            //let img = document.createElement('img')
           // img.src = reader.result
            data.image = reader.result
            loginOnPremise(data)              
          }
         
        })
      })
    }
  })
}

const getImage = (token) => {
  //https://graph.microsoft.com/v1.0/me/photo/$value
  return fetch('https://graph.microsoft.com/v1.0/me/photo/$value', { 
    headers: {'Authorization':'Bearer '+token }, 
    method: 'GET'
  })
}


  // add callback to config
  AdalConfig.default.callback = userSignedIn
  // adal global instance
  window.AuthenticationContext = AuthenticationContext
  window.ADAL = new  window.AuthenticationContext(AdalConfig.default)  
  // adal cllback
  window.ADAL.handleWindowCallback()



  console.log("%cUnauthorized Access","color: red; font-size: x-large")
  console.log("%cBidding Management System : You are trying to view the code in console","color: grey")

  // button
  document.querySelector('.btn-office365').addEventListener('click', (e) => {
      e.target.disabled = 'disabled'
      window.ADAL.login()
  })

})()
