const { Action } = require('../const')
const api = require('../util/api')
const { action, dispatches } = require('evex')
const { isAuthenticated } = require('../util/web-auth')

/**
 * TODO: verify id_token
const IdTokenVerifier = require('idtoken-verifier')

const verifier = new IdTokenVerifier({
  issuer: 'https://kt3k.auth0.com/',
  audience: 'https://buttons-backend.now.sh/'
})
*/

class UserModule {
  @action(Action.REQUEST_AUTH)
  @dispatches(Action.AUTH_READY)
  async requestAuth () {
    if (!isAuthenticated()) {
      shouldBeIn('/')

      return null
    }

    const { data: self } = await api(
      'get',
      `/users/self?i=${localStorage.id_token}`
    )

    if (self.displayId == null) {
      shouldBeIn('/set-id.html')

      return
    }

    if (self.buttons == null || self.buttons.length === 0) {
      shouldBeIn('/settings.html')

      return
    }

    return self
  }
}

const shouldBeIn = pathname => {
  if (location.pathname !== pathname) {
    location.pathname = pathname
  }
}

module.exports = UserModule
