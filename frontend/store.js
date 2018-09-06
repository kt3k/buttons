const { component } = require('capsid')
const { store, dispatches, action } = require('evex')
const { Action } = require('./const')
const { isAuthenticated } = require('./util/web-auth')

/**
 * The hub of the all models handled in this app.
 */
@component('app-store')
@store({
  modules: []
})
class Store {
  @dispatches(Action.STORE_READY)
  __mount__() {}

  @action(Action.STORE_READY)
  main() {
    console.log(isAuthenticated())
  }
}
