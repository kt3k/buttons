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

      setSession(authResult)
      location.href = '/' // TODO: use basepath env var
    })
  }
}

const setSession = authResult => {
  // Set the time that the Access Token will expire at
  const expiresAt = JSON.stringify(
    authResult.expiresIn * 1000 + new Date().getTime()
  )
  localStorage.setItem('access_token', authResult.accessToken)
  localStorage.setItem('id_token', authResult.idToken)
  localStorage.setItem('expires_at', expiresAt)
}

module.exports = AuthRedirect
