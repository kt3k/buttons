const { ApiError } = require('../util/api')
const { isValidDateStr } = require('../util/date')
const { parse } = require('date-fns')

exports.check = ({ userRepository, buttonRepository, checkService }) => async (
  req,
  res
) => {
  const authId = req.user.sub
  const user = await userRepository.getByAuthId(authId)

  const id = req.params.id
  const [button] = await buttonRepository.getByIds([id])

  if (!button) {
    throw new ApiError('The button is not found', 404, 404)
  }

  if (button.userId !== user.id) {
    throw new ApiError('The operation is not permitted', 403, 403)
  }

  const d = req.body.d

  if (!isValidDateStr(d)) {
    throw new ApiError(`Bad format date: ${d}`, 400, 400)
  }

  await checkService.check(button.id, parse(d))

  res.status(204).send('')
}

exports.uncheck = ({
  userRepository,
  buttonRepository,
  checkService
}) => async (req, res) => {
  const authId = req.user.sub
  const user = await userRepository.getByAuthId(authId)

  const id = req.params.id
  const [button] = await buttonRepository.getByIds([id])

  if (!button) {
    throw new ApiError('The button is not found', 404, 404)
  }

  if (button.userId !== user.id) {
    throw new ApiError('The operation is not permitted', 403, 403)
  }

  const d = req.body.d

  if (!isValidDateStr(d)) {
    throw new ApiError(`Bad date: ${d}`, 400, 400)
  }

  await checkService.uncheck(button.id, parse(d))

  res.status(204).send('')
}
