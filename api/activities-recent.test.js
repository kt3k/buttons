const { describe, it } = require('kocha')
const Req = require('mock-req')
const Res = require('mock-res')
const assert = require('assert')
const api = require('./activities-recent')

describe('GET /activities/recent', () => {
  it('returns the list of activities', async () => {
    const res = new Res()

    await api(
      new Req({
        method: 'GET'
      }),
      res
    )

    const json = res._getJSON()

    assert.strictEqual(res.statusCode, 200)
    assert(Array.isArray(json))
  })
})
