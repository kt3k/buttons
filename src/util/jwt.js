const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')

/**
 * Authentication middleware. When used, the
 * Access Token must exist and be verified against
 * the Auth0 JSON Web Key Set
 * @see https://auth0.com/docs/quickstart/backend/nodejs/01-authorization
 */
exports.checkJwt = jwt({
  // Dynamically provide a signing key
  // based on the kid in the header and
  // the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://kt3k.auth0.com/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: 'https://buttons-backend.now.sh/',
  issuer: `https://kt3k.auth0.com/`,
  algorithms: ['RS256']
})
