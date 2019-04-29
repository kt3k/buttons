const { describe, it } = require('kocha')
const { Check } = require('..')
const assert = require('assert')
const { parse } = require('date-fns')

const service = new Check.Service()
const repository = new Check.Repository()

describe('CheckService', () => {
  describe('check', () => {
    it('creates a check if it does not exist', async () => {
      const buttonId = 'dummy-id-foo'
      const date = parse('2018-09-29')
      await service.check(buttonId, date)

      const checks = await repository.getByButtonIdsAndDate([buttonId], date)

      assert.strictEqual(checks.length, 1)
      assert.strictEqual(checks.get(0).buttonId, buttonId)
    })

    it('does not create a check if the check already exists', async () => {
      const buttonId = 'dummy-id-bar'
      const date = parse('2018-09-29')

      await service.check(buttonId, date)
      await service.check(buttonId, date) // check twice

      const checks = await repository.getByButtonIdsAndDate([buttonId], date)

      assert.strictEqual(checks.length, 1) // only one check exists
      assert.strictEqual(checks.get(0).buttonId, buttonId)
    })
  })

  describe('uncheck', () => {
    it('removes the check if it does exist', async () => {
      const buttonId = 'dummy-id-baz'
      const date = parse('2018-09-29')

      await service.check(buttonId, date)
      await service.uncheck(buttonId, date)

      const checks = await repository.getByButtonIdsAndDate([buttonId], date)

      assert.strictEqual(checks.length, 0)
    })

    it('does not do anthing if the check does not exists', async () => {
      const buttonId = 'dummy-id-qux'
      const date = parse('2018-09-29')

      await service.uncheck(buttonId, date)

      const checks = await repository.getByButtonIdsAndDate([buttonId], date)

      assert.strictEqual(checks.length, 0)
    })
  })
})
