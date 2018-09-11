const { checkJwt } = require('../util/jwt')
const { corsOk, allowMethods, ok } = require('../util/routes')

module.exports = app => {
  app.use(corsOk)

  app.options('/users/self', allowMethods('GET'), ok)
  app.get('/users/self', checkJwt, require('./users-self'))

  app.options('/users/self/id', allowMethods('PUT'), ok)
  app.put('/users/self/id', checkJwt, require('./users-self-id'))

  app.options('/users/self/buttons', allowMethods('POST,GET'), ok)
  // get my buttons
  app.get('/users/self/buttons', checkJwt, require('./users-self-buttons').get)
  // create a button
  app.post(
    '/users/self/buttons',
    checkJwt,
    require('./users-self-buttons').post
  )

  app.options('/users/self/buttons/:id', allowMethods('PUT,DELETE'), ok)
  // update the button
  app.put(
    '/users/self/buttons/:id',
    checkJwt,
    require('./users-self-buttons-id').put
  )
  // delete the button
  app.delete(
    '/users/self/buttons/:id',
    checkJwt,
    require('./users-self-buttons-id').delete
  )
}
