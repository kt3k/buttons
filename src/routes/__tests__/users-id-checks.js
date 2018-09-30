const { describe, it } = require('kocha')
const assert = require('assert')
const { parse } = require('date-fns')

const { Check, User } = require('../../domain')

const api = require('../users-id-checks')

const Req = require('mock-express-request')
const Res = require('mock-express-response')

const services = {
  userRepository: new User.Repository(),
  checkRepository: new Check.Repository(),
  checkService: new Check.Service()
}

describe('GET /users/:id/checks?d=', () => {
  it('gets the checks of the user of the given id', async () => {
    const req = new Req()
    const res = new Res()

    const d = '2018-09-23'

    const user = await services.userRepository.getByAuthId('github|123')
    await services.checkService.check(user.buttons[0].id, parse(d))

    req.params = { id: user.id }
    req.query = { d }

    await api.get(services)(req, res)

    assert.strictEqual(res.statusCode, 200)
    assert.strictEqual(res._getJSON().length, 1)

    const checks = await services.checkRepository.getByButtonIdsAndDate(
      user.buttons[0].id,
      parse(d)
    )

    assert.strictEqual(checks.length, 1)
  })
})
