const { User } = require('../domain')

const service = new User.InitService()

module.exports = async (req, res) => {
  res.status(200).send(`You are ${req.user.sub}`)
  // await service.getOrCreate()
}
