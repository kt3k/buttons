const { describe, it } = require('kocha')
const assert = require('assert')

const api = require('./users-id')

const Req = require('mock-req')
const Res = require('mock-res')

describe('GET /users/:id', () => {
  it('gets the user by the display id', async () => {
    const res = new Res()

    await api(
      new Req({
        method: 'GET',
        url: '/users/foo'
      }),
      res
    )

    assert.strictEqual(res.statusCode, 200)
    assert.strictEqual(res._getJSON().displayId, 'foo')
    assert.strictEqual(res._getJSON().displayName, 'Buzz Foobar')
    assert.strictEqual(res._getJSON().picture, 'https://example.com/avatar.png')
    assert.strictEqual(res._getJSON().buttons.length, 4)
  })
})
