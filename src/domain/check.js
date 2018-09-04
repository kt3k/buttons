/**
 * The check model.
 */
class Check {
  constructor({ id, date, note, button }) {
    this.id = id;
    this.date = date;
    this.note = note;
    this.button = button;
  }
}

module.exports = Check;
