const { describe, it } = require('kocha')
const assert = require('assert')
const moment = require('moment')
const mongoose = require('mongoose')

const { Check } = require('..')

const repository = new Check.Repository()

describe('CheckRepository', () => {
  describe('getByButtonIdsAndDate', () => {
    it('gets the checks by the given button id and date', async () => {})
  })

  describe('getByButtonIdsAndDateRange', () => {})

  describe('save', () => {
    it('saves the check', async () => {
      const date = moment().startOf('day')
      const checkA = new Check({
        id: mongoose.Types.ObjectId().toString(),
        date,
        note: 'abc',
        buttonId: '0'
      })
      const checkB = new Check({
        id: mongoose.Types.ObjectId().toString(),
        date,
        note: 'def',
        buttonId: '1'
      })
      await repository.save(checkA)
      await repository.save(checkB)

      const checks = await repository.getByButtonIdsAndDate(['0', '1'], date)

      assert(checks instanceof Check.Collection)
      assert.strictEqual(checks.length, 2)
      assert.strictEqual(checks.getByButtonId('0').note, 'abc')
      assert.strictEqual(checks.getByButtonId('1').note, 'def')
    })
  })
})
