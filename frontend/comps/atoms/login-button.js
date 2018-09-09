const { component, on } = require('capsid')
const webAuth = require('../../util/web-auth')
const { Action } = require('../../const')

@component('login-button')
class LoginButton {
  __mount__() {
    this.el.classList.add('auth-observer')
  }

  @on(Action.AUTH_READY)
  update({ detail: self }) {
    console.log(self)
    if (!self) {
      this.el.style.display = ''
    } else if (self.displayId == null) {
      location.href = '/set-id.html' // TODO: use basepath variable
    }
    {
      this.el.style.display = 'none' // logged in
    }
  }

  @on.click
  onClick(e) {
    e.preventDefault()

    webAuth.authorize()
  }
}

module.exports = LoginButton
