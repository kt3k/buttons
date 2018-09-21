/**
 * The user model
 */
class User {
  constructor ({
    id,
    picture,
    authId,
    authData,
    displayId,
    displayName,
    buttons
  }) {
    this.id = id
    this.picture = picture
    this.authId = authId
    this.authData = authData
    this.displayId = displayId
    this.displayName = displayName
    this.buttons = buttons
  }
}

module.exports = User
