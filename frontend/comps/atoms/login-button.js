const { component, on } = require('capsid')
const webAuth = require('../../util/web-auth')

@component('login-button')
class LoginButton {
  @on.click
  onClick(e) {
    e.preventDefault()

    webAuth.authorize()
  }
}

module.exports = LoginButton
