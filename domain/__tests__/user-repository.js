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
          displayId: 'foo1',
          displayName: 'Buzz Foobar',
          buttons: []
        })
      )

      const user = await repository.getByAuthId('github|56')

      assert(user instanceof User)
      assert(typeof user.id === 'string')
      assert.strictEqual(user.picture, 'https://example.com/avatar.png')
      assert.strictEqual(user.authId, 'github|56')
      assert.deepStrictEqual(user.authData, {})
      assert(user.id != null)
      assert.strictEqual(user.displayId, 'foo1')
      assert.strictEqual(user.displayName, 'Buzz Foobar')
    })

    it('updates the existing user', async () => {
      const user0 = await repository.getByAuthId('github|56')

      user0.picture = 'https://example.com/avatar1.png'

      await repository.save(user0)

      const user1 = await repository.getByAuthId('github|56')
      assert.strictEqual(user1.picture, 'https://example.com/avatar1.png')
    })
  })

  describe('getByAuthId', () => {
    it('resolves with null if the auth id does not exist', async () => {
      const user = await repository.getByAuthId('github|999')

      assert.strictEqual(user, null)
    })
  })

  describe('getByDisplayId', () => {
    it('resolves with the user of the given display id', async () => {
      const user = await repository.getByDisplayId('foo')

      assert(user instanceof User)
      assert.strictEqual(user.authId, 'github|123')
    })

    it('resolves with null if the auth id does not exist', async () => {
      const user = await repository.getByDisplayId('non-existent')

      assert.strictEqual(user, null)
    })
  })

  describe('getById', () => {
    it('gets the user by the id', async () => {
      const user0 = await repository.getByDisplayId('foo')
      const user1 = await repository.getById(user0.id)

      assert.strictEqual(user0.authId, user1.authId)
    })
  })

  describe('getMany', () => {
    it('gets many users', async () => {
      const users = await repository.getMany()

      assert(Array.isArray(users))
      assert(users[0] instanceof User)
    })
  })

  describe('getByIds', () => {
    it('gets the users by the ids', async () => {
      const user0 = await repository.getByDisplayId('foo')
      const users = await repository.getByIds([user0.id])

      assert.strictEqual(users.length, 1)
      assert.strictEqual(users[0].authId, user0.authId)
    })
  })
})
