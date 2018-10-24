const { ApiError } = require('../util/api')
const jwt = require('jsonwebtoken')

exports.get = ({ userInitService }) => async (req, res) => {
  const idToken = req.query.i
  const authId = req.user.sub

  if (!idToken) {
    throw new ApiError('Bad request, i= query param missing', 400, 400)
  }

  const authData = jwt.decode(idToken) // TODO: Use /userinfo api (auth0) for getting user profile

  if (!authData) {
    throw new ApiError('Bad request, invalid jwt token', 400, 400)
  }

  if (authData.sub !== authId) {
    throw new ApiError('Bad request, invalid id_token', 400, 400)
  }

  const user = await userInitService.getOrCreate(authData)

  res.status(200).json(user)
}

exports.put = ({ User, userRepository }) => async (req, res) => {
  const authId = req.user.sub
  const { bio, displayName } = req.body

  if (bio && bio.length > User.BIO_MAX) {
    throw new ApiError(
      `Bad request, bio length exceeds the max number: ${User.BIO_MAX}`,
      400,
      400
    )
  }

  if (displayName && displayName.length > User.DISPLAY_NAME_MAX) {
    throw new ApiError(
      `Bad request, displayName length exceeds the max number: ${
        User.DISPLAY_NAME_MAX
      }`,
      400,
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

  res.status(200).send('')
}
