const { checkJwt } = require('../util/jwt')
const { corsOk, allowMethods, ok } = require('../util/routes')

module.exports = app => {
  app.get('/users/self', corsOk, checkJwt, require('./users-me'))
  app.options('/users/self', corsOk, allowMethods('GET'), ok)
}
