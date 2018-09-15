/**
 * The button model
 */
class Button {
  constructor({ id, name, description, userId }) {
    this.id = id
    this.name = name
    this.description = description
    this.userId = userId
  }
}

module.exports = Button
