const { checkJwt } = require('../util/jwt')
const { corsOk, allowMethods, ok } = require('../util/routes')

module.exports = app => {
  app.get('/users/self', corsOk, checkJwt, require('./users-self'))
  app.options('/users/self', corsOk, allowMethods('GET'), ok)
  app.put('/users/self/id', corsOk, checkJwt, require('./users-self-id'))
  app.options('/users/self/id', corsOk, allowMethods('PUT'), ok)
}
