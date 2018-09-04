/**
 * The user model
 */
class User {
  constructor({ id, authId, displayId, displayName, buttons }) {
    this.id = id;
    this.authId = authId;
    this.displayId = displayId;
    this.displayName = displayName;
    this.buttons = buttons;
  }
}

module.exports = User;
