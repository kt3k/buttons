const jwtAuthz = require('express-jwt-authz')
const { checkJwt } = require('../util/jwt')

module.exports = app => {
  app.get('/users/me', checkJwt, require('./users-me'))
}
