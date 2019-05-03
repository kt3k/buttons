const jwt = require('jsonwebtoken')
const jwksRsa = require('jwks-rsa')
const { ApiError } = require('./index')
const { CODE_INVALID_CREDENTIALS } = require('./error-code')

exports.jwt = jwt

const client = jwksRsa({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
  jwksUri: 'https://kt3k.auth0.com/.well-known/jwks.json'
})

exports.token = req => {
  const auth = req.headers.authorization

  if (!auth) {
    throw new ApiError('No Authorization header', CODE_INVALID_CREDENTIALS, 400)
  }

  const [scheme, token] = auth.split(' ', 2)

  if (!scheme || !token || !/^Bearer$/i.test(scheme)) {
    throw new ApiError('Invalid Credentials', CODE_INVALID_CREDENTIALS, 400)
  }

  return token
}

exports.decode = token => {
  const decoded = jwt.decode(token, { complete: true })

  if (!decoded) {
    throw new ApiError('Invalid Token', CODE_INVALID_CREDENTIALS, 400)
  }

  return decoded
}

exports.publicKey = kid =>
  new Promise((resolve, reject) => {
    client.getSigningKey(kid, (err, key) => {
      if (err) {
        return reject(err)
      }

      resolve(key.publicKey || key.rsaPublicKey)
    })
  })

exports.verify = (token, publicKey) => {
  try {
    jwt.verify(token, publicKey)
  } catch (e) {
    console.log(e)
    throw new ApiError('Invalid Token', CODE_INVALID_CREDENTIALS, 400)
  }
}

/**
 * Verifies the token and returns the token payload (= the user info)
 */
exports.verifyToken = async req => {
  const token = exports.token(req)
  const dtoken = exports.decode(token)

  if (!process.env.SKIP_JWT_VERIFY) {
    const pubKey = await exports.publicKey(dtoken.header.kid)
    exports.verify(token, pubKey)
  }

  return dtoken.payload // user
}
