const { ApiError, wrap } = require('./util')
const { userRepository, User } = require('./util/services')
const { send, json } = require('./util/micro')
const { CODE_BAD_REQUEST } = require('./util/error-code')
const { verifyToken } = require('./util/jwt')

/**
 * Sets the user's id.
 */
async function put (req, res) {
  const { sub: authId } = await verifyToken(req)
  const { id: newId } = await json(req)

  if (!newId) {
    throw new ApiError('The id parameter is missing', CODE_BAD_REQUEST, 400)
  }

  if (newId === 'self') {
    throw new ApiError(
      'self is the reserved id, and can not be taken',
      CODE_BAD_REQUEST,
      400
    )
  }

  if (!User.isValidDisplayId(newId)) {
    throw new ApiError('The id parameter is invalid', CODE_BAD_REQUEST, 400)
  }

  const existingUser = await userRepository.getByDisplayId(newId)

  if (existingUser != null) {
    throw new ApiError(`The id is unavailable: ${newId}`, CODE_BAD_REQUEST, 400)
  }

  const user = await userRepository.getByAuthId(authId)

  user.displayId = newId

  await userRepository.save(user)

  send(res, 200, { message: 'ok' })
}

module.exports = wrap({ put })
