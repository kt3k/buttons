const { describe, it } = require('kocha')
const assert = require('assert')

const api = require('../users-id')
const { User } = require('../../domain')

const Req = require('mock-express-request')
const Res = require('mock-express-response')

const services = {
  userRepository: new User.Repository()
}

describe('GET /users/:id', () => {
  it('gets the user by the display id', async () => {
    const req = new Req()
    const res = new Res()

    req.params = { id: 'foo' }

    await api.get(services)(req, res)

    assert.strictEqual(res.statusCode, 200)
    assert.strictEqual(res._getJSON().displayId, 'foo')
    assert.strictEqual(res._getJSON().displayName, 'Buzz Foobar')
    assert.strictEqual(res._getJSON().picture, 'https://example.com/avatar.png')
    assert.strictEqual(res._getJSON().buttons.length, 3)
  })
})
