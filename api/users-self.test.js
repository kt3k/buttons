const { before, describe, it } = require('kocha')
const assert = require('assert')
const api = require('./users-self')
const Req = require('mock-req')
const Res = require('mock-res')
const { User } = require('../domain')
const services = require('./util/services')
const { token, headers } = require('./test-helper')
const {
  CODE_INVALID_CREDENTIALS,
  CODE_BAD_REQUEST
} = require('./util/error-code')

describe('GET /users/self', () => {
  it('creates the user', async () => {
    const res = new Res()

    await api(
      new Req({
        method: 'GET',
        url: `/users/self?i=${token}`,
        headers
      }),
      res
    )

    assert.strictEqual(res.statusCode, 200)
    assert.deepStrictEqual(
      { ...res._getJSON(), id: 'dummy' },
      {
        id: 'dummy',
        picture: null,
        authId: '1234567890',
        authData: {},
        displayId: null,
        displayName: 'John Doe',
        bio: null,
        buttons: []
      }
    )
  })

  it('throws 400 when i param is missing', async () => {
    const res = new Res()

    await api(
      new Req({
        method: 'GET',
        url: '/users/self',
        headers
      }),
      res
    )

    assert.strictEqual(res.statusCode, 400)
    assert.strictEqual(res._getJSON().code, CODE_INVALID_CREDENTIALS)
  })

  it('throws 400 when id_token is invalid', async () => {
    const res = new Res()

    await api(
      new Req({
        method: 'GET',
        url: '/users/self?=abc',
        headers
      }),
      res
    )

    assert.strictEqual(res.statusCode, 400)
    assert.strictEqual(res._getJSON().code, CODE_INVALID_CREDENTIALS)
  })
})

describe('PUT /users/self', () => {
  /**
   * payload {
   *   sub: 'put-self-test|123'
   * }
   */
  const token0 =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkFCQyJ9.eyJzdWIiOiJwdXQtc2VsZi10ZXN0fDEyMyJ9.qxyhAlfGuTFoFhxWWE9Kz6_ttc87RXbvb3Bo0A82i5o'
  const headers0 = {
    authorization: `Bearer ${token0}`
  }

  before(async () => {
    await new User.InitService().getOrCreate({ sub: 'put-self-test|123' })
  })

  it("modifies the user's displayName", async () => {
    const req = new Req({
      method: 'PUT',
      url: '/users/self',
      headers: headers0
    })
    const res = new Res()
    req.write({ displayName: 'Put Self' })
    req.end()

    await api(req, res)

    assert.strictEqual(res.statusCode, 200)

    const user = await services.userRepository.getByAuthId('put-self-test|123')

    assert.strictEqual(user.displayName, 'Put Self')
  })

  it("modifies the user's bio", async () => {
    const req = new Req({
      method: 'PUT',
      url: '/users/self',
      headers: headers0
    })
    const res = new Res()
    req.write({ bio: 'I was born here.' })
    req.end()

    await api(req, res)

    assert.strictEqual(res.statusCode, 200)

    const user = await services.userRepository.getByAuthId('put-self-test|123')

    assert.strictEqual(user.bio, 'I was born here.')
  })

  it('throws when the display name length exceeds the max', async () => {
    const req = new Req({
      method: 'PUT',
      url: '/users/self',
      headers: headers0
    })
    const res = new Res()
    req.write({ displayName: 'a'.repeat(User.DISPLAY_NAME_MAX + 1) })
    req.end()

    await api(req, res)

    assert.strictEqual(res.statusCode, 400)
    assert.strictEqual(res._getJSON().code, CODE_BAD_REQUEST)
  })

  it('throws when the bio length exceeds the max', async () => {
    const req = new Req({
      method: 'PUT',
      url: '/users/self',
      headers: headers0
    })
    const res = new Res()
    req.write({ bio: 'a'.repeat(User.BIO_MAX + 1) })
    req.end()

    await api(req, res)

    assert.strictEqual(res.statusCode, 400)
    assert.strictEqual(res._getJSON().code, CODE_BAD_REQUEST)
  })
})
