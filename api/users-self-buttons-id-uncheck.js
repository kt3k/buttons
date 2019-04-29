const { ApiError, wrap } = require('./util')
const { verifyToken } = require('./util/jwt')
const { isValidDateStr } = require('../util/date')
const { parse } = require('date-fns')
const { send, match, json } = require('./util/micro')
const {
  CODE_NOT_FOUND,
  CODE_UNAUTHORIZED,
  CODE_BAD_REQUEST
} = require('./util/error-code')
const {
  userRepository,
  buttonRepository,
  checkService
} = require('./util/services')

async function post (req, res) {
  const { sub: authId } = await verifyToken(req)
  const user = await userRepository.getByAuthId(authId)

  if (!user) {
    throw new ApiError('The user is not found', CODE_NOT_FOUND, 404)
  }

  const { id } = match(
    '/users/self/buttons/:id/uncheck',
    require('url').parse(req.url).pathname
  )
  const [button] = await buttonRepository.getByIds([id])

  if (!button) {
    throw new ApiError('The button is not found', CODE_NOT_FOUND, 404)
  }

  if (button.userId !== user.id) {
    throw new ApiError('The operation is not permitted', CODE_UNAUTHORIZED, 403)
  }

  const { d } = await json(req)

  if (!isValidDateStr(d)) {
    throw new ApiError(`Bad date: ${d}`, CODE_BAD_REQUEST, 400)
  }

  await checkService.uncheck(button.id, parse(d))

  send(res, 204, '')
}

module.exports = wrap({ post })
