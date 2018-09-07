const { component } = require('capsid')
const { store, dispatches, action } = require('evex')
const { Action } = require('./const')
const { isAuthenticated } = require('./util/web-auth')

/**
 * The hub of the all models handled in this app.
 */
@component('app-store')
@store({
  modules: [require('./modules/user')]
})
class Store {
  __mount__() {
    this.main()
  }

  @dispatches(Action.REQUEST_SELF)
  main() {
    console.log(isAuthenticated())
  }
}
