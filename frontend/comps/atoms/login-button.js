const { component, on } = require('capsid')
const webAuth = require('../../util/web-auth')
const { Action } = require('../../const')

@component('login-button')
class LoginButton {
  __mount__ () {
    this.el.classList.add('auth-observer')
  }

  @on(Action.AUTH_READY)
  update ({ detail: self }) {
    if (!self) {
      this.el.style.display = ''
    } else {
      this.el.style.display = 'none' // logged in
    }
  }

  @on.click
  onClick (e) {
    e.preventDefault()

    webAuth.authorize()
  }
}

module.exports = LoginButton
