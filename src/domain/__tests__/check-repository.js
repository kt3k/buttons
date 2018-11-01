const { describe, it } = require('kocha')
const assert = require('assert')
const { parse, startOfToday } = require('date-fns')
const mongoose = require('mongoose')

const { Check, DailyCheckRecord } = require('..')

const repository = new Check.Repository()
const service = new Check.Service()

describe('CheckRepository', () => {
  describe('getByButtonIdsAndDate', () => {
    it('gets checks by the given button id and date', async () => {})
  })

  describe('getByButtonIdsAndDateRange', () => {
    it('gets an array of the daily check records of the give button ids and date ranges', async () => {
      const id0 = 'dummy-bid0'
      const id1 = 'dummy-bid1'
      const buttonIds = [id0, id1]

      await service.check(id0, parse('2018-01-05'))
      await service.check(id0, parse('2018-01-06'))
      await service.check(id0, parse('2018-01-07'))
      await service.check(id0, parse('2018-01-08'))
      await service.check(id0, parse('2018-01-09'))

      await service.check(id1, parse('2018-01-05'))
      // await service.check(id1, parse('2018-01-06'))
      await service.check(id1, parse('2018-01-07'))
      // await service.check(id1, parse('2018-01-08'))
      await service.check(id1, parse('2018-01-09'))

      const records = await repository.getByButtonIdsAndDateRange(
        buttonIds,
        parse('2018-01-06'),
        parse('2018-01-08')
      )

      assert(Array.isArray(records))
      assert.strictEqual(records.length, 3)
      assert(records[0] instanceof DailyCheckRecord)
      assert.strictEqual(records[0].count(), 1)
      assert(records[1] instanceof DailyCheckRecord)
      assert.strictEqual(records[1].count(), 2)
      assert(records[2] instanceof DailyCheckRecord)
      assert.strictEqual(records[2].count(), 1)
    })
  })

  describe('save', () => {
    it('saves the check', async () => {
      const date = startOfToday()
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
      const date = startOfToday()
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
