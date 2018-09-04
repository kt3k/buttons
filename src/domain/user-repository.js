const mongoose = require("mongoose");
const User = require("./user");

const userSchema = new mongoose.Schema({
  authId: String,
  displayId: String,
  displayName: String,
  buttonIds: [String]
});

const UserODM = mongoose.model("User", userSchema);

class UserRepository {
  /**
   * Saves the user.
   * @param {User} user
   */
  save(user) {
    return new UserODM({
      _id: user.id,
      authId: user.authId,
      displayId: user.displayId,
      displayName: user.displayName,
      buttonIds: user.buttons.map(button => button.id)
    }).save();
  }

  async getByAuthId(authId) {
    const userObj = await UserODM.findOne({ authId }).exec();

    if (userObj == null) {
      return null;
    }

    return new User({
      id: userObj._id,
      authId: userObj.authId,
      displayId: userObj.displayId,
      displayName: userObj.displayName,
      buttons: [] // TODO: Find buttons
    });
  }
}

module.exports = UserRepository;
