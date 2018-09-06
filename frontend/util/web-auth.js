const auth0 = require('auth0-js')

module.exports = new auth0.WebAuth({
  domain: 'kt3k.auth0.com',
  clientID: 'QLqktKiyNtfN3izRtkrfOB4UCG49a4V1',
  responseType: 'token id_token',
  scope: 'openid',
  redirectUri: window.location.href + 'callback.html'
})
