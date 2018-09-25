const { component, on } = require('capsid')
const { Action } = require('../../const')

@component('nav-settings-area')
class NavSettingsArea {
  __mount__ () {
    this.el.classList.add('auth-observer')
  }

  @on(Action.AUTH_READY)
  update ({ detail: self }) {
    if (!self) {
      this.el.style.display = 'none'
    } else {
      this.el.style.display = '' // logged in
    }
  }
}

module.exports = NavSettingsArea
