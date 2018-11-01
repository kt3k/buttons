const mongoose = require('mongoose')
const User = require('./user')
const ButtonRepository = require('./button-repository')

const userSchema = new mongoose.Schema({
  picture: String,
  authId: String,
  authDataJson: String,
  displayId: String,
  displayName: String,
  bio: String,
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
          bio: user.bio,
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
      bio: userObj.bio,
      buttons
    })
  }

  static userObjToUserWithoutButtons (userObj) {
    return new User({
      id: userObj._id.toString(),
      picture: userObj.picture,
      authId: userObj.authId,
      authData: {},
      displayId: userObj.displayId,
      displayName: userObj.displayName,
      bio: userObj.bio,
      buttons: []
    })
  }

  /**
   * Gets at most 1000 users.
   * @return {Promise<User[]>}
   */
  async getMany () {
    const userArray = await UserODM.find({})
      .limit(1000)
      .exec()

    return userArray.map(this.constructor.userObjToUserWithoutButtons)
  }

  /**
   * @param {string[]}
   * @return {User[]}
   */
  async getByIds (ids) {
    const userArray = await UserODM.find({
      _id: { $in: ids.map(mongoose.Types.ObjectId) }
    }).exec()

    return userArray.map(this.constructor.userObjToUserWithoutButtons)
  }
}

module.exports = UserRepository
