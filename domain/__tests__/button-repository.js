const { describe, it } = require('kocha')
const assert = require('assert')
const { Button } = require('..')
const mongoose = require('mongoose')

const repository = new Button.Repository()

describe('ButtonRepository', () => {
  describe('save', () => {
    it('saves the button', async () => {
      const userId = '123'

      const ids = [
        mongoose.Types.ObjectId(),
        mongoose.Types.ObjectId(),
        mongoose.Types.ObjectId()
      ].map(id => id.toString())

      const buttonA = new Button({ id: ids[0], name: 'A', userId })
      const buttonB = new Button({ id: ids[1], name: 'B', userId })
      const buttonC = new Button({ id: ids[2], name: 'C', userId })

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

    it('updates the given button when it already exists', async () => {
      const userId = '123'

      const id = mongoose.Types.ObjectId().toString()

      await repository.save(new Button({ id, name: 'button-test', userId }))

      const [button0] = await repository.getByIds([id])
      button0.name = 'button-test-2'
      await repository.save(button0)

      const [button1] = await repository.getByIds([id])

      assert.strictEqual(button1.id, id)
      assert.strictEqual(button1.name, 'button-test-2')
    })
  })
})
