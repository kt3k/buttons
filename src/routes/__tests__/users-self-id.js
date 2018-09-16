const { describe, it } = require('kocha')

const api = require('../users-self-id')
const Req = require('mock-express-request')
const Res = require('mock-express-response')
const assert = require('assert')
const { ApiError } = require('../../util/api')

const { User } = require('../../domain')
const userRepository = new User.Repository()

describe('PUT /users/self/id', () => {
  it("modifies the user's id", async () => {
    const req = new Req()
    const res = new Res()
    req.user = { sub: 'id-test|123' }
    req.body = { id: 'jiro' }

    await new User.InitService().getOrCreate({ sub: 'id-test|123' })

    await api.put({ userRepository })(req, res)

    assert.strictEqual(res.statusCode, 200)

    const user = await userRepository.getByAuthId('id-test|123')

    assert.strictEqual(user.displayId, 'jiro')
  })

  it('throws if the id parameter is missing in the request', async () => {
    const req = new Req()
    const res = new Res()

    req.user = { sub: 'github|123' }
    req.body = {}

    try {
      await api.put({ userRepository })(req, res)
      return new Error('The api should throw')
    } catch (e) {
      assert(e instanceof ApiError)
      assert.strictEqual(e.message, 'The id parameter is missing')
    }
  })

  it('throws if the id is unavailable', async () => {
    const req = new Req()
    const res = new Res()

    req.user = { sub: 'github|123' }
    req.body = { id: 'foo' }

    try {
      await api.put({ userRepository })(req, res)
      return new Error('The api should throw')
    } catch (e) {
      assert(e instanceof ApiError)
      assert.strictEqual(e.message, 'The id is unavailable: foo')
    }
  })
})
