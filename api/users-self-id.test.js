const { describe, it } = require('kocha')
const api = require('./users-self-id')
const Req = require('mock-req')
const Res = require('mock-res')
const assert = require('assert')
const { User, userRepository } = require('./util/services')
const { ghHeaders } = require('./test-helper')
const { CODE_BAD_REQUEST } = require('./util/error-code')

/**
 * payload {
 *   sub: 'id-test|123',
 *   name: 'Sam'
 * }
 */
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJpZC10ZXN0fDEyMyIsIm5hbWUiOiJTYW0ifQ.C3nysJ5516FIfK4aD7AUNKu6a07NunUwao3a4dX8RSs'
const headers = {
  authorization: `Bearer ${token}`
}

describe('PUT /users/self/id', () => {
  it("modifies the user's id", async () => {
    const res = new Res()
    const req = new Req({
      method: 'PUT',
      url: '/users/self/id',
      headers
    })
    req.write({ id: 'jiro' })
    req.end()

    await new User.InitService().getOrCreate({ sub: 'id-test|123' })

    await api(req, res)

    assert.strictEqual(res.statusCode, 200)

    const user = await userRepository.getByAuthId('id-test|123')

    assert.strictEqual(user.displayId, 'jiro')
  })

  it('throws if the id parameter is missing in the request', async () => {
    const res = new Res()
    const req = new Req({
      method: 'PUT',
      url: '/users/self/id',
      headers: ghHeaders
    })
    req.write({})
    req.end()

    await api(req, res)
    assert.strictEqual(res.statusCode, 400)
    assert.strictEqual(res._getJSON().code, CODE_BAD_REQUEST)
  })

  it('throws if the id parameter is `self`', async () => {
    const res = new Res()
    const req = new Req({
      method: 'PUT',
      url: '/users/self/id',
      headers: ghHeaders
    })
    req.write({ id: 'self' })
    req.end()

    await api(req, res)
    assert.strictEqual(res.statusCode, 400)
    assert.strictEqual(res._getJSON().code, CODE_BAD_REQUEST)
  })

  it('throws if the id parameter is invalid', async () => {
    const res = new Res()
    const req = new Req({
      method: 'PUT',
      url: '/users/self/id',
      headers: ghHeaders
    })
    req.write({ id: '-a' })
    req.end()

    await api(req, res)

    assert.strictEqual(res.statusCode, 400)
    assert.strictEqual(res._getJSON().code, CODE_BAD_REQUEST)
  })

  it('throws if the id is unavailable', async () => {
    const res = new Res()
    const req = new Req({
      method: 'PUT',
      url: '/users/self/id',
      headers: ghHeaders
    })
    req.write({ id: 'foo' })
    req.end()

    await api(req, res)

    assert.strictEqual(res.statusCode, 400)
    assert.strictEqual(res._getJSON().code, CODE_BAD_REQUEST)
  })
})
