const Navigo = import('navigo')

Navigo.then((Navigo) => {
  const appRoute = new Navigo.default('http://localhost/bms_rethink/www/',  true)
  appRoute.on({
    '' : () =>{
      // redirect to home by default
      window.location.hash = '/home'
    },
    '/auth' :  () =>  {
      // redirect to o365 authentication page
      window.location = 'auth.html'
    },
    '/home' : () => {
      console.log('home')
    }
  }).resolve()
})