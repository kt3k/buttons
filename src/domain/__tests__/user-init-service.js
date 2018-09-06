const { describe, it } = require('kocha')
const assert = require('assert')
const { User } = require('..')

const service = new User.InitService()
const repository = new User.Repository()

describe('UserInitService', () => {
  describe('getOrCreate', () => {
    it('gets the user if they already exist', async () => {
      const authData = { sub: 'github|123' }

      const user = await service.getOrCreate(authData)

      assert(user instanceof User)
      assert.strictEqual(user.authId, 'github|123')
    })

    it('creates the user if they do not exist', async () => {
      assert.strictEqual(await repository.getByAuthId('github|357'), null)

      const authData = { sub: 'github|357' }

      const user = await service.getOrCreate(authData)

      assert(user instanceof User)
      assert.strictEqual(user.authId, 'github|357')
    })

    it('throws if the authData.sub is undefined', done => {
      service.getOrCreate({}).then(
        () => {
          done(new Error('should throw'))
        },
        e => {
          assert(e instanceof Error)
          done()
        }
      )
    })
  })
})
