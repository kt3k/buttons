const ActivityRepository = require('./activity-repository')
const Activity = require('./activity')

const activityRepository = new ActivityRepository()

class ActivityService {
  async createPushActivity (user, button) {
    await activityRepository.save(
      new Activity({
        type: Activity.PUSH,
        user,
        button,
        date: new Date(),
        info: {}
      })
    )
  }

  async createCreateActivity (user, button) {
    await activityRepository.save(
      new Activity({
        type: Activity.CREATE,
        user,
        button,
        date: new Date(),
        info: {}
      })
    )
  }
}

module.exports = ActivityService
