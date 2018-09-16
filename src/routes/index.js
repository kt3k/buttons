const { checkJwt } = require('../util/jwt')
const { corsOk, allowMethods, ok } = require('../util/routes')
const { handleApiError } = require('../util/api')
const { User, Button } = require('../domain')

const services = {
  userRepository: new User.Repository(),
  userInitService: new User.InitService(),
  userButtonService: new User.ButtonService(),
  buttonRepository: new Button.Repository()
}

module.exports = app => {
  app.use(corsOk)

  app.options('/users/self', allowMethods('GET'), ok)
  app.get(
    '/users/self',
    checkJwt,
    handleApiError(require('./users-self')(services))
  )

  app.options('/users/self/id', allowMethods('PUT'), ok)
  app.put(
    '/users/self/id',
    checkJwt,
    handleApiError(require('./users-self-id').put(services))
  )

  app.options('/users/self/buttons', allowMethods('POST,GET'), ok)
  // get my buttons
  app.get(
    '/users/self/buttons',
    checkJwt,
    handleApiError(require('./users-self-buttons').get(services))
  )
  // create a button
  app.post(
    '/users/self/buttons',
    checkJwt,
    handleApiError(require('./users-self-buttons').post(services))
  )

  app.options('/users/self/buttons/:id', allowMethods('PUT,DELETE'), ok)
  // update the button
  app.put(
    '/users/self/buttons/:id',
    checkJwt,
    handleApiError(require('./users-self-buttons-id').put(services))
  )
  // delete the button
  app.delete(
    '/users/self/buttons/:id',
    checkJwt,
    handleApiError(require('./users-self-buttons-id').delete(sevices))
  )
}
