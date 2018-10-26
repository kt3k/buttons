const { checkJwt } = require('../util/jwt')
const { corsOk, allowMethods, ok } = require('../util/routes')
const { handleApiError } = require('../util/api')
const { User, Button, Check } = require('../domain')

const services = {
  User,
  userRepository: new User.Repository(),
  userInitService: new User.InitService(),
  userButtonService: new User.ButtonService(),
  buttonRepository: new Button.Repository(),
  checkRepository: new Check.Repository(),
  checkService: new Check.Service()
}

module.exports = app => {
  app.use(corsOk)

  // Health check endpoint
  app.options('/', allowMethods('GET'), ok)
  app.get('/', (req, res) => {
    res.status(200).json({ message: 'ok' })
  })

  // Gets the list of (random) users
  app.options('/users', allowMethods('GET'), ok)
  app.get('/users', handleApiError(require('./users').get(services)))

  // Gets myself
  app.options('/users/self', allowMethods('GET,PUT'), ok)
  app.get(
    '/users/self',
    checkJwt,
    handleApiError(require('./users-self').get(services))
  )
  app.put(
    '/users/self',
    checkJwt,
    handleApiError(require('./users-self').put(services))
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
    handleApiError(require('./users-self-buttons-id').delete(services))
  )

  app.options('/users/self/buttons/:id/check', allowMethods('POST'), ok)
  app.post(
    '/users/self/buttons/:id/check',
    checkJwt,
    handleApiError(require('./users-self-buttons-id-check').check(services))
  )

  app.options('/users/self/buttons/:id/uncheck', allowMethods('POST'), ok)
  app.post(
    '/users/self/buttons/:id/uncheck',
    checkJwt,
    handleApiError(require('./users-self-buttons-id-check').uncheck(services))
  )

  app.options('/users/:id/checks', allowMethods('GET'), ok)
  app.get(
    '/users/:id/checks',
    handleApiError(require('./users-id-checks').get(services))
  )

  // Gets the user
  app.options('/users/:id', allowMethods('GET'), ok)
  app.get('/users/:id', handleApiError(require('./users-id').get(services)))
}
