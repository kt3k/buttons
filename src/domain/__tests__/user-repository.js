const { describe, it } = require('kocha')
const assert = require('assert')
const { User } = require('..')

const repository = new User.Repository()

describe('UserRepository', () => {
  describe('save', () => {
    it('saves the user', async () => {
      await repository.save(
        new User({
          picture: 'https://example.com/avatar.png',
          authId: 'github|56',
          authData: {},
          displayId: 'foo',
          displayName: 'Buzz Foobar',
          buttons: []
        })
      )

      const user = await repository.getByAuthId('github|56')

      assert(user instanceof User)
      assert.strictEqual(user.picture, 'https://example.com/avatar.png')
      assert.strictEqual(user.authId, 'github|56')
      assert.deepStrictEqual(user.authData, {})
      assert(user.id != null)
      assert.strictEqual(user.displayId, 'foo')
      assert.strictEqual(user.displayName, 'Buzz Foobar')
    })

    it('updates the existing user', async () => {
      const user0 = await repository.getByAuthId('github|123')

      user0.displayName = 'Fizz Boofar'

      await repository.save(user0)

      const user1 = await repository.getByAuthId('github|123')
      assert.strictEqual(user1.displayName, 'Fizz Boofar')
    })
  })

  describe('getByAuthId', () => {
    it('resolves with null if the auth id does not exist', async () => {
      const user = await repository.getByAuthId('github|999')

      assert.equal(user, null)
    })
  })
})
