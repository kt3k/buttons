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

      assert.strictEqual(user1.buttons.length, 2)
    })
  })

  describe('deleteById', () => {
    it('deletes the button for the user by the given id', () => {})
  })
})
