export default {
  instance: 'https://login.microsoftonline.com/', 
  tenant: 'common', //COMMON OR YOUR TENANT ID
  clientId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx', //This is your client ID
  redirectUri: `http://localhost/bms_rethink/www/auth.html`, //This is your redirect URI
  cacheLocation: 'localStorage',
  // callback: userSignedIn,
  popUp: true,
  endpoints : {"https://graph.microsoft.com": "https://graph.microsoft.com"},
}