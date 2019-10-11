const {
  ApiError,
  userToUserDtoWithButtons,
  wrap,
  getPathname
} = require('./util')
const { userRepository } = require('./util/services')
const { match, send } = require('./util/micro')
const { CODE_NOT_FOUND } = require('./util/error-code')

async function get (req, res) {
  const { id: displayId } = match('/users/:id', getPathname(req.url))

  const user = await userRepository.getByDisplayId(displayId)

  if (!user) {
    throw new ApiError('The user not found', CODE_NOT_FOUND, 404)
  }

  send(res, 200, userToUserDtoWithButtons(user))
}

module.exports = wrap({ get })
