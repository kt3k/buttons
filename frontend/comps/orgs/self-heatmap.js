const { component, on, emits } = require('capsid')
const { Action } = require('../../const')

@component('self-heatmap')
class SelfHeatmap {
  __mount__ () {
    this.el.classList.add('auth-observer')
  }

  @on(Action.AUTH_READY)
  @emits(Action.FILL_USER)
  fillUser ({ detail: user }) {
    return user
  }
}

module.exports = SelfHeatmap
