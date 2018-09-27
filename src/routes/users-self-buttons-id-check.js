exports.check = () => async (req, res) => {
  /*
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
  */
}

exports.uncheck = () => async (req, res) => {}
