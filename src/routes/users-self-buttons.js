/**
 * Gets the user's buttons.
 * @param req
 * @param res
 */
exports.get = ({ userRepository }) => async (req, res) => {
  const user = await userRepository.getByAuthId(req.user.sub)

  res.status(200).json(user.buttons)
}

exports.post = ({ userButtonService, userRepository }) => async (req, res) => {
  const user = await userRepository.getByAuthId(req.user.sub)

  const newButton = await userButtonService.createButton(user, {
    name: req.body.name,
    description: req.body.description
  })

  res.status(200).json(newButton)
}
