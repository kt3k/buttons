exports.get = ({ userRepository }) => async (req, res) => {
  const users = await userRepository.getMany()

  res.status(200).json(users.map(userToUserDto))
}

const userToUserDto = user => ({
  displayId: user.displayId,
  displayName: user.displayName,
  picture: user.picture
})
