/**
 * CheckCollection is the collection model of the check.
 */
class CheckCollection {
  /**
   * @param {Check[]} checks
   */
  constructor (checks = []) {
    this.checks = []
    this.checkMap = {}

    checks.forEach(check => {
      this.add(check)
    })
  }

  get length () {
    return this.checks.length
  }

  /**
   *
   * @param {string} buttonId
   * @return {Check}
   */
  getByButtonId (buttonId) {
    return this.checkMap[buttonId]
  }

  /**
   * Gets the check by the index.
   * @param {number} index
   * @return {Check}
   */
  get (index) {
    return this.checks[index]
  }

  add (check) {
    this.checks.push(check)
    this.checkMap[check.buttonId] = check
  }
}

module.exports = CheckCollection
