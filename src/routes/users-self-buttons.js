/**
 * Gets the user's buttons.
 * @param req
 * @param res
 */
exports.get = ({ userRepository }) => async (req, res) => {
  const user = await userRepository.getByAuthId(req.user.sub)

  res.status(200).json(user.buttons)
}

exports.post = ({
  userButtonService,
  userRepository,
  activityService
}) => async (req, res) => {
  const user = await userRepository.getByAuthId(req.user.sub)

  const newButton = await userButtonService.createButton(user, {
    name: req.body.name,
    description: req.body.description
  })

  // Don't affect the api call
  setTimeout(() => {
    activityService.createCreateActivity(user, newButton)
  })

  res.status(200).json(newButton)
}
