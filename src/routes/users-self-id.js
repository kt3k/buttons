const { ApiError } = require('../util/api')

/**
 * Sets the user's id.
 */
exports.put = ({ userRepository, User }) => async (req, res) => {
  const authId = req.user.sub
  const newId = req.body.id

  if (!newId) {
    throw new ApiError('The id parameter is missing', 400, 400)
  }

  if (!User.isValidDisplayId(newId)) {
    throw new ApiError('The id parameter is invalid', 400, 400)
  }

  const existingUser = await userRepository.getByDisplayId(newId)

  if (existingUser != null) {
    throw new ApiError(`The id is unavailable: ${newId}`, 400, 400)
  }

  const user = await userRepository.getByAuthId(authId)

  user.displayId = newId

  await userRepository.save(user)

  res.status(200).json({ message: 'ok' })
}
