const mongoose = require('mongoose')
const { startOfDay, isSameDay } = require('date-fns')

const Check = require('./check')
const CheckCollection = require('./check-collection')
const DailyCheckRecord = require('./daily-check-record')

const checkSchema = new mongoose.Schema({
  id: String,
  date: Date,
  note: String,
  buttonId: String
})

const CheckODM = mongoose.model('Check', checkSchema)

const last = arr => arr[arr.length - 1]

class CheckRepository {
  /**
   * Converts the check object to a check.
   * @param {Object} checkObj
   * @return {Check}
   */
  static checkObjToCheck (checkObj) {
    return new Check({
      id: checkObj._id.toString(),
      date: checkObj.date,
      note: checkObj.note,
      buttonId: checkObj.buttonId,
      createdAt: {
        type: Date,
        default: Date.now
      }
    })
  }

  /**
   * @param {string[]} buttonIds
   * @param {Date} date
   * @return {Promise<CheckCollection>}
   */
  async getByButtonIdsAndDate (buttonIds, date) {
    const checkArray = await CheckODM.find({
      buttonId: { $in: buttonIds },
      date: date
    }).exec()

    return new CheckCollection(checkArray.map(this.constructor.checkObjToCheck))
  }

  /**
   * @param {string[]} buttonIds
   * @param {Date} startDate
   * @param {Date} endDate
   * @return {Promise<DailyCheckRecord[]>}
   */
  async getByButtonIdsAndDateRange (buttonIds, startDate, endDate) {
    const $gte = startOfDay(startDate)
    const $lte = startOfDay(endDate)

    const checkArray = await CheckODM.find({
      buttonId: { $in: buttonIds },
      date: { $gte, $lte }
    })
      .sort('date')
      .exec()

    const records = []

    checkArray.forEach(checkObj => {
      const check = this.constructor.checkObjToCheck(checkObj)

      const lastRecord = last(records)

      if (lastRecord != null && isSameDay(lastRecord.date, check.date)) {
        lastRecord.add(check)
      } else {
        records.push(this.createNewDailyCheckRecord(check))
      }
    })

    return records
  }

  createNewDailyCheckRecord (check) {
    return new DailyCheckRecord({
      date: check.date,
      checks: new CheckCollection([check])
    })
  }

  /**
   * @param {Check} check
   * @return {Promise<void>}
   */
  async save (check) {
    await new Promise((resolve, reject) => {
      CheckODM.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(check.id) },
        {
          date: check.date,
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
   * @param {Date} date
   */
  async deleteByButtonIdAndDate (buttonId, date) {
    await CheckODM.findOneAndRemove({
      date: date,
      buttonId
    }).exec()
  }
}

module.exports = CheckRepository
