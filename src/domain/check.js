/**
 * The check model.
 */
class Check {
  constructor ({ id, date, note, buttonId }) {
    this.id = id
    this.date = date
    this.note = note
    this.buttonId = buttonId
  }
}

module.exports = Check
