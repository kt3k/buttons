const { ApiError, wrap, getPathname } = require('./util')
const { isValidDateStr } = require('../util/date')
const { parseISO } = require('date-fns')
const { verifyToken } = require('./util/jwt')
const { send, match, json } = require('./util/micro')
const {
  CODE_BAD_REQUEST,
  CODE_UNAUTHORIZED,
  CODE_NOT_FOUND
} = require('./util/error-code')
const {
  userRepository,
  buttonRepository,
  checkService,
  activityService
} = require('./util/services')

async function post (req, res) {
  const { sub: authId } = await verifyToken(req)
  const user = await userRepository.getByAuthId(authId)

  if (!user) {
    throw new ApiError('The user is not found', CODE_NOT_FOUND, 404)
  }

  const { id } = match('/users/self/buttons/:id/check', getPathname(req.url))
  const [button] = await buttonRepository.getByIds([id])

  if (!button) {
    throw new ApiError('The button is not found', CODE_NOT_FOUND, 404)
  }

  if (button.userId !== user.id) {
    throw new ApiError('The operation is not permitted', CODE_UNAUTHORIZED, 403)
  }

  const { d } = await json(req)

  if (!isValidDateStr(d)) {
    throw new ApiError(`Bad format date: ${d}`, CODE_BAD_REQUEST, 400)
  }

  const checkPromise = checkService.check(button.id, parseISO(d))
  const activityPromise = activityService.createPushActivity(user, button)

  await Promise.all([checkPromise, activityPromise])

  send(res, 204, '')
}

module.exports = wrap({ post })
