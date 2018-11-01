const mongoose = require('mongoose')
const Activity = require('./activity')
const ButtonRepository = require('./button-repository')
const UserRepository = require('./user-repository')
const { uniq } = require('../util/array')

const buttonRepository = new ButtonRepository()
const userRepository = new UserRepository()

const activitySchema = new mongoose.Schema({
  type: String,
  userId: String,
  buttonId: String,
  info: Object,
  date: Date
})

const ActivityODM = mongoose.model('Activity', activitySchema)

class ActivityRepository {
  /**
   *
   * @param {Activity} activity
   */
  async save (activity) {
    await ActivityODM.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(activity.id) },
      {
        type: activity.type,
        userId: activity.user.id,
        buttonId: activity.button.id,
        date: activity.date,
        info: activity.info
      },
      { upsert: true }
    ).exec()
  }

  /**
   *
   * @return {Promise<Activity[]>}
   */
  async getRecent () {
    const activityArray = await ActivityODM.find({})
      .limit(50)
      .sort('-date')
      .exec()

    const buttonIds = uniq(activityArray.map(obj => obj.buttonId))
    const userIds = uniq(activityArray.map(obj => obj.userId))

    const requestButtons = buttonRepository.getByIds(buttonIds)
    const requestUsers = userRepository.getByIds(userIds)

    const buttons = await requestButtons
    const users = await requestUsers

    const buttonMap = this.constructor.createMapFromModels(buttons)
    const userMap = this.constructor.createMapFromModels(users)

    return activityArray.map(obj =>
      this.constructor.objToActivity(obj, buttonMap, userMap)
    )
  }

  /**
   * @param {Array<Model>}
   * @return {Map<string, Model>}
   */
  static createMapFromModels (models) {
    const map = new Map()

    models.forEach(model => {
      map.set(model.id, model)
    })

    return map
  }

  /**
   * @param {Object} obj
   * @param {Map<string, Button>} buttonMap
   * @param {Map<string, User>} userMap
   * @return {Activity}
   */
  static objToActivity (obj, buttonMap, userMap) {
    return new Activity({
      id: obj._id.toString(),
      type: obj.type,
      user: userMap.get(obj.userId),
      button: buttonMap.get(obj.buttonId),
      date: obj.date,
      info: obj.info
    })
  }
}

module.exports = ActivityRepository
