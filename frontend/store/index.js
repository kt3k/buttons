const { component, notifies } = require('capsid')
const { store, dispatches, action } = require('evex')
const { Action } = require('../const')

/**
 * The hub of the all models handled in this app.
 */
@component('app-store')
@store({
  modules: [require('./auth')]
})
class Store {
  @dispatches(Action.REQUEST_AUTH)
  __mount__() {}

  @action(Action.AUTH_READY)
  @notifies(Action.AUTH_READY, '.auth-observer')
  authReady(store, { detail: self }) {
    return self
  }
}
