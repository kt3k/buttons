const { describe, it } = require('kocha')
const assert = require('assert')
const Req = require('mock-req')
const Res = require('mock-res')
const { parse } = require('date-fns')
const { userRepository, checkRepository } = require('./util/services')
const checkApi = require('./users-self-buttons-id-check')
const uncheckApi = require('./users-self-buttons-id-uncheck')
const { ghHeaders: headers } = require('./test-helper')

describe('POST /users/self/buttons/:id/check', () => {
  it('creates a check', async () => {
    const res = new Res()

    const user = await userRepository.getByAuthId('github|123')
    const button = user.buttons[0]

    const d = '2018-09-27'

    const req = new Req({
      method: 'POST',
      url: `/users/self/buttons/${button.id}/check`,
      headers
    })
    req.write({ d })
    req.end()

    await checkApi(req, res)

    const checks = await checkRepository.getByButtonIdsAndDate(
      button.id,
      parse(d)
    )

    assert.strictEqual(res.statusCode, 204)
    assert.strictEqual(checks.length, 1)
  })
})

describe('POST /users/self/buttons/:id/uncheck', () => {
  it('removes a check', async () => {
    const user = await userRepository.getByAuthId('github|123')
    const button = user.buttons[0]

    const d = '2018-09-30'

    const res0 = new Res()
    const req0 = new Req({
      method: 'POST',
      url: `/users/self/buttons/${button.id}/check`,
      headers
    })
    req0.write({ d })
    req0.end()

    await checkApi(req0, res0)

    assert.strictEqual(res0.statusCode, 204)

    const res1 = new Res()
    const req1 = new Req({
      method: 'POST',
      url: `/users/self/buttons/${button.id}/uncheck`,
      headers
    })
    req1.write({ d })
    req1.end()

    await uncheckApi(req1, res1)

    const checks = await checkRepository.getByButtonIdsAndDate(
      button.id,
      parse(d)
    )

    assert.strictEqual(res1.statusCode, 204)
    assert.strictEqual(checks.length, 0)
  })
})
