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

    req.params = { id: user.displayId }
    req.query = { d }

    await api.get(services)(req, res)

    assert.strictEqual(res.statusCode, 200)
    assert.deepStrictEqual(res._getJSON(), [
      {
        buttonId: user.buttons[0].id
      }
    ])

    const checks = await services.checkRepository.getByButtonIdsAndDate(
      user.buttons[0].id,
      parse(d)
    )

    assert.strictEqual(checks.length, 1)
  })
})

describe('GET /users/:id/checks?from=&to=', () => {
  it('gets the checks of the given range', async () => {
    const req = new Req()
    const res = new Res()

    const user = await services.userRepository.getByAuthId('github|123')

    const id0 = user.buttons[0].id
    const id1 = user.buttons[1].id

    await services.checkService.check(id0, parse('2016-01-05'))
    await services.checkService.check(id0, parse('2016-01-06'))
    // await services.checkService.check(id0, parse('2016-01-07'))
    // await services.checkService.check(id0, parse('2016-01-08'))
    await services.checkService.check(id0, parse('2016-01-09'))
    await services.checkService.check(id0, parse('2016-01-10'))

    await services.checkService.check(id1, parse('2016-01-05'))
    await services.checkService.check(id1, parse('2016-01-06'))
    // await services.checkService.check(id1, parse('2016-01-07'))
    await services.checkService.check(id1, parse('2016-01-08'))
    // await services.checkService.check(id0, parse('2016-01-09'))
    await services.checkService.check(id0, parse('2016-01-10'))

    req.params = { id: user.displayId }
    req.query = { from: '2016-01-06', to: '2016-01-09' }

    await api.get(services)(req, res)

    assert.strictEqual(res.statusCode, 200)
    assert.deepStrictEqual(res._getJSON(), [
      {
        date: '2016-01-06',
        checks: [
          {
            buttonId: id0
          },
          {
            buttonId: id1
          }
        ]
      },
      {
        date: '2016-01-08',
        checks: [
          {
            buttonId: id1
          }
        ]
      },
      {
        date: '2016-01-09',
        checks: [
          {
            buttonId: id0
          }
        ]
      }
    ])
  })
})
