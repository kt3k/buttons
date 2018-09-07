const { Action } = require('../const')
const api = require('../util/api')
const { action, dispatches } = require('evex')

class UserModule {
  @action(Action.REQUEST_SELF)
  @dispatches(Action.SELF_READY)
  async requestSelf() {
    await api('get', '/users/self')
  }
}

module.exports = UserModule
