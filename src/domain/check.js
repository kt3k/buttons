/**
 * The check model.
 */
class Check {
  constructor ({ id, date, note, buttonId, createdAt }) {
    this.id = id
    this.date = date
    this.note = note
    this.buttonId = buttonId
    this.createdAt = createdAt
  }
}

module.exports = Check
