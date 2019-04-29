const { wrap } = require('./util')
const { verifyToken } = require('./util/jwt')
const { send, json } = require('./util/micro')
const {
  userButtonService,
  userRepository,
  activityService
} = require('./util/services')

/**
 * Gets the user's buttons.
 * @param req
 * @param res
 */
async function get (req, res) {
  const { sub } = await verifyToken(req)
  const user = await userRepository.getByAuthId(sub)

  send(res, 200, user.buttons)
}

async function post (req, res) {
  const { sub } = await verifyToken(req)
  const user = await userRepository.getByAuthId(sub)

  const { name, description } = await json(req)

  const newButton = await userButtonService.createButton(user, {
    name,
    description
  })

  // Don't affect the api call
  setTimeout(() => {
    activityService.createCreateActivity(user, newButton)
  })

  send(res, 200, newButton)
}

module.exports = wrap({ get, post })
