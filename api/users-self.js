const { ApiError, wrap } = require('./util')
const { jwt, verifyToken } = require('./util/jwt')
const { send, json, query } = require('./util/micro')
const { userInitService, User, userRepository } = require('./util/services')
const {
  CODE_INVALID_CREDENTIALS,
  CODE_BAD_REQUEST
} = require('./util/error-code')

async function get (req, res) {
  const { i: idToken } = query(req)

  const { sub: authId } = await verifyToken(req)

  if (!idToken) {
    throw new ApiError(
      'Bad request, i= query param missing',
      CODE_INVALID_CREDENTIALS,
      400
    )
  }

  const authData = jwt.decode(idToken) // TODO: Use /userinfo api (auth0) for getting user profile

  if (!authData) {
    throw new ApiError(
      'Bad request, invalid jwt token',
      CODE_INVALID_CREDENTIALS,
      400
    )
  }

  if (authData.sub !== authId) {
    throw new ApiError(
      'Bad request, invalid id_token',
      CODE_INVALID_CREDENTIALS,
      400
    )
  }

  const user = await userInitService.getOrCreate(authData)

  send(res, 200, user)
}

async function put (req, res) {
  const { sub: authId } = await verifyToken(req)

  let body

  try {
    body = await json(req)
  } catch (e) {
    console.log(e)
    throw new ApiError(e.message, CODE_BAD_REQUEST, 400)
  }

  const { bio, displayName } = body

  if (bio && bio.length > User.BIO_MAX) {
    throw new ApiError(
      `Bad request, bio length exceeds the max number: ${User.BIO_MAX}`,
      CODE_BAD_REQUEST,
      400
    )
  }

  if (displayName && displayName.length > User.DISPLAY_NAME_MAX) {
    throw new ApiError(
      `Bad request, displayName length exceeds the max number: ${
        User.DISPLAY_NAME_MAX
      }`,
      CODE_BAD_REQUEST,
      400
    )
  }

  const user = await userRepository.getByAuthId(authId)

  if (bio) {
    user.bio = bio
  }

  if (displayName) {
    user.displayName = displayName
  }

  await userRepository.save(user)

  send(res, 200, '')
}

module.exports = wrap({ get, put })
