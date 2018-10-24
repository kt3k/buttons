const RE_VALID_DISPLAY_ID = /^[0-9a-z][0-9a-z_-]*$/

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

  static isValidDisplayId (displayId) {
    return RE_VALID_DISPLAY_ID.test(displayId)
  }
}

module.exports = User
