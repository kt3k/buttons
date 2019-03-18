const auth0 = require('auth0-js')

module.exports = new auth0.WebAuth({
  domain: 'kt3k.auth0.com',
  clientID: 'QLqktKiyNtfN3izRtkrfOB4UCG49a4V1',
  responseType: 'token id_token',
  audience: 'https://buttons-backend.now.sh/',
  scope: 'openid profile',
  redirectUri: window.location.href + 'callback.html'
})

module.exports.isAuthenticated = () => {
  // Check whether the current time is past the
  // Access Token's expiry time
  const expiresAt = JSON.parse(localStorage.getItem('expires_at'))
  return new Date().getTime() < expiresAt
}

module.exports.setSession = authResult => {
  // Set the time that the Access Token will expire at
  const expiresAt = JSON.stringify(
    authResult.expiresIn * 1000 + new Date().getTime()
  )
  localStorage.setItem('access_token', authResult.accessToken)
  localStorage.setItem('id_token', authResult.idToken)
  localStorage.setItem('expires_at', expiresAt)
}
