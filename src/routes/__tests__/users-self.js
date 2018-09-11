const { describe, it } = require('kocha')
const api = require('../users-self')
const Req = require('mock-express-request')
const Res = require('mock-express-response')
const assert = require('assert')
const { ApiError } = require('../../util/api')

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
      async getOrCreate(authData) {
        return authData
      }
    }

    await api({ userInitService })(req, res)

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

    const userInitService = {
      async getOrCreate(authData) {
        return authData
      }
    }

    try {
      await api({ userInitService })(req, res)
    } catch (e) {
      assert(e instanceof ApiError)
      assert.strictEqual(e.code, 400)
      assert.strictEqual(e.status, 400)
    }
  })

  it('throws 400 when id_token is invalid', async () => {
    const req = new Req()
    const res = new Res()

    req.query = { i: 'abc' }
    req.user = { sub: '1234567890' }

    const userInitService = {
      async getOrCreate(authData) {
        return authData
      }
    }

    try {
      await api({ userInitService })(req, res)
    } catch (e) {
      assert(e instanceof ApiError)
      assert.strictEqual(e.code, 400)
      assert.strictEqual(e.status, 400)
    }
  })
  it('throws 400 when i param is missing', async () => {
    const req = new Req()
    const res = new Res()

    req.query = { i: token }
    req.user = { sub: '1234567890a' }

    const userInitService = {
      async getOrCreate(authData) {
        return authData
      }
    }

    try {
      await api({ userInitService })(req, res)
    } catch (e) {
      assert(e instanceof ApiError)
      assert.strictEqual(e.code, 400)
      assert.strictEqual(e.status, 400)
    }
  })
})
