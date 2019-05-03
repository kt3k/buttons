const { describe, it } = require('kocha')
const assert = require('assert')
const { parse } = require('date-fns')

const services = require('./util/services')

const api = require('./users-id-checks')

const Req = require('mock-req')
const Res = require('mock-res')

describe('GET /users/:id/checks?d=', () => {
  it('gets the checks of the user of the given id', async () => {
    const d = '2018-09-23'

    const user = await services.userRepository.getByAuthId('github|123')
    await services.checkService.check(user.buttons[0].id, parse(d))

    const res = new Res()

    await api(
      new Req({
        method: 'GET',
        url: `/users/${user.displayId}/checks?d=${d}`
      }),
      res
    )

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

    await api(
      new Req({
        method: 'GET',
        url: `/users/${user.displayId}/checks?from=2016-01-06&to=2016-01-09`
      }),
      res
    )

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
