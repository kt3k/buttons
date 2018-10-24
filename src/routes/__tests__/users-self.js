const { before, describe, it } = require('kocha')
const api = require('../users-self')
const Req = require('mock-express-request')
const Res = require('mock-express-response')
const assert = require('assert')
const { ApiError } = require('../../util/api')
const { User } = require('../../domain')

const services = {
  User,
  userRepository: new User.Repository()
}

/**
 * payload:
 * {
 *   "sub": "1234567890",
 *   "name": "John Doe",
 *   "iat": 1516239022
 * }
 */
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

describe('GET /users/self', () => {
  it('creates the user', async () => {
    const req = new Req()
    const res = new Res()

    req.query = { i: token }
    req.user = { sub: '1234567890' }

    const userInitService = {
      async getOrCreate (authData) {
        return authData
      }
    }

    await api.get({ userInitService })(req, res)

    assert.strictEqual(res.statusCode, 200)
    assert.deepStrictEqual(res._getJSON(), {
      sub: '1234567890',
      name: 'John Doe',
      iat: 1516239022
    })
  })

  it('throws 400 when i param is missing', async () => {
    const req = new Req()
    const res = new Res()

    req.query = {}
    req.user = { sub: '1234567890' }

    try {
      await api.get(services)(req, res)
    } catch (e) {
      assert(e instanceof ApiError)
      assert.strictEqual(e.code, 400)
      assert.strictEqual(e.status, 400)
      return
    }

    throw new Error('The api should throw')
  })

  it('throws 400 when id_token is invalid', async () => {
    const req = new Req()
    const res = new Res()

    req.query = { i: 'abc' }
    req.user = { sub: '1234567890' }

    try {
      await api.get(services)(req, res)
    } catch (e) {
      assert(e instanceof ApiError)
      assert.strictEqual(e.code, 400)
      assert.strictEqual(e.status, 400)
      return
    }

    throw new Error('The api should throw')
  })

  it('throws 400 when i param is missing', async () => {
    const req = new Req()
    const res = new Res()

    req.query = { i: token }
    req.user = { sub: '1234567890a' }

    try {
      await api.get(services)(req, res)
    } catch (e) {
      assert(e instanceof ApiError)
      assert.strictEqual(e.code, 400)
      assert.strictEqual(e.status, 400)
      return
    }

    throw new Error('The api should throw')
  })
})

describe('PUT /users/self', () => {
  before(async () => {
    await new User.InitService().getOrCreate({ sub: 'put-self-test|123' })
  })

  it("modifies the user's displayName", async () => {
    const req = new Req()
    const res = new Res()
    req.user = { sub: 'put-self-test|123' }
    req.body = { displayName: 'Put Self' }

    await api.put(services)(req, res)

    assert.strictEqual(res.statusCode, 200)

    const user = await services.userRepository.getByAuthId('put-self-test|123')

    assert.strictEqual(user.displayName, 'Put Self')
  })

  it("modifies the user's bio", async () => {
    const req = new Req()
    const res = new Res()
    req.user = { sub: 'put-self-test|123' }
    req.body = { bio: 'I was born here.' }

    await api.put(services)(req, res)

    assert.strictEqual(res.statusCode, 200)

    const user = await services.userRepository.getByAuthId('put-self-test|123')

    assert.strictEqual(user.bio, 'I was born here.')
  })

  it('throws when the display name length exceeds the max', async () => {
    const req = new Req()
    const res = new Res()
    req.user = { sub: 'put-self-test|123' }
    req.body = { displayName: 'a'.repeat(User.DISPLAY_NAME_MAX + 1) }

    try {
      await api.put(services)(req, res)
    } catch (e) {
      assert(e instanceof ApiError)
      assert.strictEqual(e.code, 400)
      assert.strictEqual(e.status, 400)
      return
    }

    throw new Error('The api should throw')
  })

  it('throws when the bio length exceeds the max', async () => {
    const req = new Req()
    const res = new Res()
    req.user = { sub: 'put-self-test|123' }
    req.body = { bio: 'a'.repeat(User.BIO_MAX + 1) }

    try {
      await api.put(services)(req, res)
    } catch (e) {
      assert(e instanceof ApiError)
      assert.strictEqual(e.code, 400)
      assert.strictEqual(e.status, 400)
      return
    }

    throw new Error('The api should throw')
  })
})
