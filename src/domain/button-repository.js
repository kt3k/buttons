const mongoose = require("mongoose");

const buttonSchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  userId: String
});

const Button = mongoose.model("Button", buttonSchema);

class ButtonRepository {
  /**
   * @param {Button} button
   */
  save(button) {
    return Button.update(
      { _id: button.id },
      {
        name: button.name,
        description: button.description,
        userId: button.user.id
      },
      { upsert: true }
    );
  }
}

module.exports = ButtonRepository;
