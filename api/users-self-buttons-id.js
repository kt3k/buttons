const { ApiError, wrap, getPathname } = require('./util')
const { verifyToken } = require('./util/jwt')
const {
  userRepository,
  buttonRepository,
  userButtonService
} = require('./util/services')
const { match, send, json } = require('./util/micro')
const { CODE_NOT_FOUND, CODE_UNAUTHORIZED } = require('./util/error-code')

async function put (req, res) {
  const { sub: authId } = await verifyToken(req)
  const user = await userRepository.getByAuthId(authId)

  const { id } = match('/users/self/buttons/:id', getPathname(req.url))
  const [button] = await buttonRepository.getByIds([id])

  if (!button) {
    throw new ApiError('The button is not found', CODE_NOT_FOUND, 404)
  }

  if (button.userId !== user.id) {
    throw new ApiError('The operation is not permitted', CODE_UNAUTHORIZED, 403)
  }

  const buttonObj = await json(req)
  Object.assign(button, {
    name: buttonObj.name,
    description: buttonObj.description
  })

  await buttonRepository.save(button)

  send(res, 200, button)
}

async function del (req, res) {
  const { sub: authId } = await verifyToken(req)
  const user = await userRepository.getByAuthId(authId)

  const { id } = match('/users/self/buttons/:id', getPathname(req.url))
  const [button] = await buttonRepository.getByIds([id])

  if (!button) {
    throw new ApiError('The button is not found', CODE_NOT_FOUND, 404)
  }

  if (button.userId !== user.id) {
    throw new ApiError('The operation is not permitted', CODE_UNAUTHORIZED, 403)
  }

  await userButtonService.deleteById(user, button.id)

  send(res, 204, '')
}

module.exports = wrap({ put, delete: del })
