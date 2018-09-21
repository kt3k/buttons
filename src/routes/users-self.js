const { ApiError } = require('../util/api')
const jwt = require('jsonwebtoken')

module.exports = ({ userInitService }) => async (req, res) => {
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
