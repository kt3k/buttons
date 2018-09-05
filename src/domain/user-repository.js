const mongoose = require("mongoose")
const User = require("./user")

const userSchema = new mongoose.Schema({
  picture: String,
  authId: String,
  authDataJson: String,
  displayId: String,
  displayName: String,
  buttonIds: [String]
})

const UserODM = mongoose.model("User", userSchema)

class UserRepository {
  /**
   * Saves the user.
   * @param {User} user
   */
  save(user) {
    return new UserODM({
      _id: user.id,
      picture: user.picture,
      authId: user.authId,
      authData: JSON.stringify(user.authData),
      displayId: user.displayId,
      displayName: user.displayName,
      buttonIds: user.buttons.map(button => button.id)
    }).save()
  }

  async getByAuthId(authId) {
    const userObj = await UserODM.findOne({ authId }).exec()

    if (userObj == null) {
      return null
    }

    let authData = {}

    try {
      authData = JSON.parse(userObj.authDataJson)
    } catch (e) {
      // pass
    }

    return new User({
      id: userObj._id,
      picture: userObj.picture,
      authId: userObj.authId,
      authData,
      displayId: userObj.displayId,
      displayName: userObj.displayName,
      buttons: [] // TODO: Find buttons
    })
  }
}

module.exports = UserRepository
