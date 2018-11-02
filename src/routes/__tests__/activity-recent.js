const { describe, it } = require('kocha')
const Req = require('mock-express-request')
const Res = require('mock-express-response')
const assert = require('assert')
const api = require('../activities-recent')
const { Activity } = require('../../domain')

const activityRepository = new Activity.Repository()
const services = { activityRepository }

describe('GET /activities/recent', () => {
  it('returns the list of activities', async () => {
    const res = new Res()
    const req = new Req()

    await api(services)(req, res)

    const json = res._getJSON()

    assert.strict(res.statusCode, 200)
    assert(Array.isArray(json))
  })
})
