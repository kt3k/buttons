const mongoose = require('mongoose')
const Button = require('./button')

const buttonSchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  userId: String
})

const ButtonODM = mongoose.model('Button', buttonSchema)

class ButtonRepository {
  /**
   * @param {Button} button
   */
  async save(button) {
    await new Promise((resolve, reject) => {
      ButtonODM.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(button.id) },
        {
          name: button.name,
          description: button.description,
          userId: button.userId
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

  /**
   * @param {string[]} ids
   * @return {Promise<Button[]>}
   */
  async getByIds(ids) {
    const buttonArray = await ButtonODM.find({
      _id: { $in: ids.map(mongoose.Types.ObjectId) }
    })

    return buttonArray.map(this.constructor.buttonObjToButton)
  }

  static buttonObjToButton(buttonObj) {
    return new Button({
      id: buttonObj._id.toString(),
      name: buttonObj.name,
      description: buttonObj.description,
      userId: buttonObj.userId
    })
  }
}

module.exports = ButtonRepository
