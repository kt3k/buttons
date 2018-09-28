const CheckRepository = require('./check-repository')
const Check = require('./check')

const repository = new CheckRepository()

class CheckService {
  /**
   * @param {string} buttonId
   * @param {moment} date
   * @return {Promise<void>}
   */
  async check (buttonId, date) {
    const checks = await repository.getByButtonIdsAndDate([buttonId], date)

    if (checks.length > 0) {
      // Already checked
      return
    }

    // Creates a new check
    await repository.save(
      new Check({
        buttonId,
        date
      })
    )
  }

  /**
   * @param {string} buttonId
   * @param {moment} date
   */
  async uncheck (buttonId, date) {
    await repository.deleteByButtonIdAndDate(buttonId, date)
  }
}

module.exports = CheckService
