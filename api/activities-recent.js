const { activityToActivityDto, wrap } = require('./util')
const { activityRepository } = require('./util/services')
const { send } = require('./util/micro')

async function get (req, res) {
  const activities = await activityRepository.getRecent()

  send(res, 200, activities.map(activityToActivityDto))
}

module.exports = wrap({ get })
