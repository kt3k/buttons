const { ApiError, userToUserDtoWithButtons } = require('../util/api')

exports.get = ({ userRepository }) => async (req, res) => {
  const displayId = req.params.id

  const user = await userRepository.getByDisplayId(displayId)

  if (!user) {
    throw new ApiError('The user not found', 404, 404)
  }

  res.status(200).json(userToUserDtoWithButtons(user))
}
