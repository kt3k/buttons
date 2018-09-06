const { component, on } = require('capsid')
const auth0 = require('auth0-js')

@component('login-button')
class LoginButton {
  constructor() {
    this.webAuth = new auth0.WebAuth({
      domain: 'kt3k.auth0.com',
      clientID: 'QLqktKiyNtfN3izRtkrfOB4UCG49a4V1',
      responseType: 'token id_token',
      scope: 'openid',
      redirectUri: window.location.href
    })
  }

  @on.click
  onClick(e) {
    e.preventDefault()

    this.webAuth.authorize()
  }
}

module.exports = LoginButton
