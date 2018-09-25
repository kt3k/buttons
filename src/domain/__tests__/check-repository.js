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

  describe('deleteByButtonIdAndDate', () => {
    it('deletes the check by the button id and date', async () => {
      const date = moment().startOf('day')
      const checkA = new Check({
        id: mongoose.Types.ObjectId().toString(),
        date,
        note: 'abc',
        buttonId: '3'
      })
      const checkB = new Check({
        id: mongoose.Types.ObjectId().toString(),
        date,
        note: 'def',
        buttonId: '4'
      })
      await repository.save(checkA)
      await repository.save(checkB)

      const checks0 = await repository.getByButtonIdsAndDate(['3', '4'], date)

      assert.strictEqual(checks0.length, 2)

      await repository.deleteByButtonIdAndDate('3', date)

      const checks1 = await repository.getByButtonIdsAndDate(['3', '4'], date)

      assert.strictEqual(checks1.length, 1)
      assert.strictEqual(checks1.getByButtonId('3'), undefined)
      assert(checks1.getByButtonId('4') instanceof Check)
    })
  })
})
