const { ApiError } = require('../util/api')

exports.put = ({ userRepository, buttonRepository }) => async (req, res) => {
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

  const buttonObj = req.body
  Object.assign(button, {
    name: buttonObj.name,
    description: buttonObj.description
  })

  await buttonRepository.save(button)

  res.status(200).json(button)
}

exports.delete = ({
  userRepository,
  buttonRepository,
  userButtonService
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

  await userButtonService.deleteById(user, button.id)

  res.status(204).send('')
}
