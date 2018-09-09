const { User } = require('../domain')

const repository = new User.Repository()

module.exports = async (req, res) => {
  const authId = req.user.sub

  const user = await repository.getByAuthId(authId)

  const newId = req.body.id

  user.displayId = newId

  await repository.save(user)

  res.status(200).json({ message: 'ok' })
}
