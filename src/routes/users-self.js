const { User } = require('../domain')
const jwt = require('jsonwebtoken')

const service = new User.InitService()

module.exports = async (req, res) => {
  const idToken = req.query.i

  if (!idToken) {
    res.status(400).json({ message: 'Bad request, i= query param missing' })
    return
  }

  const authData = jwt.decode(idToken) // TODO: Use /userinfo api (auth0) for getting user profile

  if (!authData) {
    res.status(400).json({ message: 'Bad request, invalid jwt token' })
    return
  }

  try {
    const user = await service.getOrCreate(authData)

    res.status(200).json(user)
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
