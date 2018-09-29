const mongoose = require('mongoose')
const User = require('./user')
const ButtonRepository = require('./button-repository')

const userSchema = new mongoose.Schema({
  picture: String,
  authId: String,
  authDataJson: String,
  displayId: String,
  displayName: String,
  buttonIds: [String]
})

const buttonRepository = new ButtonRepository()

const UserODM = mongoose.model('User', userSchema)

class UserRepository {
  /**
   * Saves the user.
   * @param {User} user
   */
  save (user) {
    return new Promise((resolve, reject) => {
      UserODM.findOneAndUpdate(
        { authId: user.authId },
        {
          picture: user.picture,
          authId: user.authId,
          authData: JSON.stringify(user.authData),
          displayId: user.displayId,
          displayName: user.displayName,
          buttonIds: user.buttons.map(button => button.id)
        },
        { upsert: true },
        (err, doc) => {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }
      )
    })
  }

  async getByAuthId (authId) {
    const userObj = await UserODM.findOne({ authId }).exec()

    return this.userObjToUser(userObj)
  }

  async getByDisplayId (displayId) {
    const userObj = await UserODM.findOne({ displayId }).exec()

    return this.userObjToUser(userObj)
  }

  /**
   *
   * @param {string} id
   * @return {Promise<User>
   */
  async getById (id) {
    const userObj = await UserODM.findById(id).exec()

    return this.userObjToUser(userObj)
  }

  async userObjToUser (userObj) {
    if (userObj == null) {
      return null
    }

    let authData = {}

    try {
      authData = JSON.parse(userObj.authDataJson)
    } catch (e) {
      // pass
    }

    const buttons = await buttonRepository.getByIds(userObj.buttonIds)

    return new User({
      id: userObj._id.toString(),
      picture: userObj.picture,
      authId: userObj.authId,
      authData,
      displayId: userObj.displayId,
      displayName: userObj.displayName,
      buttons
    })
  }
}

module.exports = UserRepository
