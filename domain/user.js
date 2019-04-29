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
    bio,
    buttons
  }) {
    this.id = id
    this.picture = picture
    this.authId = authId
    this.authData = authData
    this.displayId = displayId
    this.displayName = displayName
    this.bio = bio
    this.buttons = buttons
  }

  static isValidDisplayId (displayId) {
    return RE_VALID_DISPLAY_ID.test(displayId)
  }
}

User.BIO_MAX = 3000
User.DISPLAY_ID_MAX = 100
User.DISPLAY_NAME_MAX = 100

module.exports = User
