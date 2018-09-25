const mongoose = require('mongoose')
const moment = require('moment')

const Check = require('./check')
const CheckCollection = require('./check-collection')

const checkSchema = new mongoose.Schema({
  id: String,
  date: Date,
  note: String,
  buttonId: String
})

const CheckODM = mongoose.model('Check', checkSchema)

class CheckRepository {
  /**
   * Converts the check object to a check.
   * @param {Object} checkObj
   * @return {Check}
   */
  static checkObjToCheck (checkObj) {
    return new Check({
      id: checkObj._id.toString(),
      date: moment(checkObj.date),
      note: checkObj.note,
      buttonId: checkObj.buttonId
    })
  }

  /**
   * @param {string[]} buttonIds
   * @param {moment} date
   * @return {Promise<CheckCollection>}
   */
  async getByButtonIdsAndDate (buttonIds, date) {
    /*
    const d = date.clone().startOf('day')
    const $gte = d.toDate()
    const $lt = d.add(1, 'days').toDate()
    */
    const checkArray = await CheckODM.find({
      buttonId: { $in: buttonIds },
      date: date.toDate()
    }).exec()

    return new CheckCollection(checkArray.map(this.constructor.checkObjToCheck))
  }

  /**
   * @param {string[]} buttonIds
   * @param {moment} startDate
   * @param {moment} endDate
   * @return {Promise<CheckCollection>}
   */
  async getByButtonIdsAndDateRange (buttonIds, startDate, endDate) {}

  /**
   * @param {Check} check
   * @return {Promise<void>}
   */
  async save (check) {
    await new Promise((resolve, reject) => {
      CheckODM.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(check.id) },
        {
          date: check.date.toDate(),
          note: check.note,
          buttonId: check.buttonId
        },
        { upsert: true },
        (err, doc) => {
          if (err) {
            reject(err)
            return
          }

          resolve()
        }
      )
    })
  }

  /**
   * @param {string} buttonId
   * @param {moment} date
   */
  async deleteByButtonIdAndDate (buttonId, date) {
    await CheckODM.findOneAndRemove({
      date: date.toDate(),
      buttonId
    }).exec()
  }
}

module.exports = CheckRepository
