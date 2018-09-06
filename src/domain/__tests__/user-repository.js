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
  })

  describe('getByAuthId', () => {
    it('resolves with null if the auth id does not exist', async () => {
      const user = await repository.getByAuthId('github|999')

      assert.equal(user, null)
    })
  })
})
