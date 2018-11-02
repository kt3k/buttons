const { activityToActivityDto } = require('../util/api')

module.exports = ({ activityRepository }) => async (req, res) => {
  const activities = await activityRepository.getRecent()

  res.status(200).json(activities.map(activityToActivityDto))
}
