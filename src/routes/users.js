const { userToUserDto } = require('../util/api')

exports.get = ({ userRepository }) => async (req, res) => {
  const users = await userRepository.getMany()

  res.status(200).json(users.map(userToUserDto))
}
