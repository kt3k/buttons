const { describe, it } = require('kocha')
const assert = require('assert')
const moment = require('moment')
const Req = require('mock-express-request')
const Res = require('mock-express-response')

const { User, Button, Check } = require('../../domain')

const userRepository = new User.Repository()
const checkRepository = new Check.Repository()

const services = {
  userRepository,
  buttonRepository: new Button.Repository(),
  checkService: new Check.Service()
}

const api = require('../users-self-buttons-id-check')

describe('POST /users/self/buttons/:id/check', () => {
  it('creates a check', async () => {
    const req = new Req()
    const res = new Res()

    const user = await userRepository.getByAuthId('github|123')
    const button = user.buttons[0]

    const d = '2018-09-27'

    req.user = { sub: 'github|123' }
    req.params = { id: button.id }
    req.query = { d }

    await api.check(services)(req, res)

    const checks = await checkRepository.getByButtonIdsAndDate(
      button.id,
      moment(d)
    )

    assert.strictEqual(checks.length, 1)
  })
})

describe('POST /users/self/buttons/:id/uncheck', () => {
  it('removes a check', async () => {
    const user = await userRepository.getByAuthId('github|123')
    const button = user.buttons[0]

    const d = '2018-09-30'

    const req = new Req()
    const res0 = new Res()

    req.user = { sub: 'github|123' }
    req.params = { id: button.id }
    req.query = { d }

    await api.check(services)(req, res0)

    const res1 = new Res()

    await api.uncheck(services)(req, res1)

    const checks = await checkRepository.getByButtonIdsAndDate(
      button.id,
      moment(d)
    )

    assert.strictEqual(checks.length, 0)
  })
})
