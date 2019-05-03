const { describe, it } = require('kocha')
const { User } = require('..')
const assert = require('assert')

const userRepository = new User.Repository()
const service = new User.ButtonService()

describe('UserButtonService', () => {
  describe('createButton', () => {
    it('creates a button for the user with the given info', async () => {
      const user = await userRepository.getByAuthId('github|123')

      await service.createButton(user, {
        name: 'milk',
        description: 'Buy a milk'
      })
      await service.createButton(user, {
        name: 'beer',
        description: 'Buy a beer'
      })

      const user1 = await userRepository.getByAuthId('github|123')

      assert.strictEqual(user1.buttons.length, 4) // This user has 2 buttons at the start
    })
  })

  describe('deleteById', () => {
    it('deletes the button for the user by the given id', async () => {
      const user = await userRepository.getByAuthId('github|123')

      await service.createButton(user, {
        name: 'notebook',
        description: 'Buy a notebook'
      })

      const user1 = await userRepository.getByAuthId('github|123')

      const lastButton = user1.buttons[user1.buttons.length - 1]

      assert.strictEqual(lastButton.name, 'notebook')

      await service.deleteById(user1, lastButton.id)

      const user2 = await userRepository.getByAuthId('github|123')

      // notebook button is deleted
      assert(user2.buttons.every(button => button.name !== 'notebook'))
    })
  })
})
