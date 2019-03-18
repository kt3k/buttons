const { component } = require('capsid')
const webAuth = require('../../util/web-auth')

@component('auth-redirect')
class AuthRedirect {
  __mount__ () {
    webAuth.parseHash((err, authResult) => {
      if (err) {
        console.log(err)
        alert(
          'Error: ' + err.error + '. Check the console for further details.'
        )
        // TODO: send error to somewhere
        return
      }

      if (!(authResult && authResult.accessToken && authResult.idToken)) {
        console.log('incomplete authResult')
        // TODO: send error to somewhere
      }

      webAuth.setSession(authResult)
      location.href = '/' // TODO: use basepath env var
    })
  }
}

module.exports = AuthRedirect
