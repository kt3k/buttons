const mongoose = require('mongoose')

const UserRepository = require('./user-repository')
const userRepository = new UserRepository()
const Button = require('./button')
const ButtonRepository = require('./button-repository')
const buttonRepository = new ButtonRepository()

/**
 * UserButtonService provides the function to associate or deassociate buttons to the user.
 */
class UserButtonService {
  /**
   * Creates a button for the given user with the given info.
   * @param {User} user
   * @param {Object} buttonObj
   */
  async createButton (user, buttonObj) {
    const button = new Button(buttonObj)
    button.id = mongoose.Types.ObjectId().toString()
    button.userId = user.id

    user.buttons.push(button)

    await Promise.all([
      buttonRepository.save(button),
      userRepository.save(user)
    ])

    const [button0] = await buttonRepository.getByIds([button.id])

    return button0
  }

  /**
   * Deletes the button by id.
   * @param {User} user The user
   * @param {string} buttonId
   */
  async deleteById (user, buttonId) {
    user.buttons = user.buttons.filter(button => button.id !== buttonId)

    await userRepository.save(user)
  }
}

module.exports = UserButtonService
