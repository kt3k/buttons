const { describe, it } = require("kocha")
const assert = require("assert")
const { Button, User } = require("..")
const mongoose = require("mongoose")

const repository = new Button.Repository()

describe("ButtonRepository", () => {
  describe("save", () => {
    it("saves the button", async () => {
      const user = new User({
        id: "123"
      })

      const ids = [
        mongoose.Types.ObjectId(),
        mongoose.Types.ObjectId(),
        mongoose.Types.ObjectId()
      ].map(id => id.toString())

      const buttonA = new Button({ id: ids[0], name: "A", user })
      const buttonB = new Button({ id: ids[1], name: "B", user })
      const buttonC = new Button({ id: ids[2], name: "C", user })

      await repository.save(buttonA)
      await repository.save(buttonB)
      await repository.save(buttonC)

      const buttons = await repository.getByIds(ids)

      assert.strictEqual(buttons.length, 3)
      assert(buttons[0] instanceof Button)
      assert(buttons[1] instanceof Button)
      assert(buttons[2] instanceof Button)
      assert.strictEqual(buttons[0].id, ids[0])
      assert.strictEqual(buttons[1].id, ids[1])
      assert.strictEqual(buttons[2].id, ids[2])
    })
  })
})
