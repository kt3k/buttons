/**
 * The button model
 */
class Button {
  constructor({ id, name, description, user }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.user = user;
  }
}

module.exports = Button;
