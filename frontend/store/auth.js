const { Action } = require('../const')
const api = require('../util/api')
const { action, dispatches } = require('evex')
const { isAuthenticated } = require('../util/web-auth')

const IdTokenVerifier = require('idtoken-verifier')

const verifier = new IdTokenVerifier({
  issuer: 'https://kt3k.auth0.com/',
  audience: 'https://buttons-backend.now.sh/'
})

class UserModule {
  @action(Action.REQUEST_AUTH)
  @dispatches(Action.AUTH_READY)
  async requestAuth() {
    if (!isAuthenticated()) {
      return null
    }

    const decoded = verifier.decode(localStorage.id_token)

    console.log(decoded)

    return await api('get', '/users/self')
  }
}

module.exports = UserModule
