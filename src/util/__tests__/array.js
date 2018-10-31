const { describe, it } = require('kocha')
const { uniq } = require('../array')
const assert = require('assert')

describe('util/array', () => {
  describe('uniq', () => {
    it('filters duplicated items', () => {
      assert.deepStrictEqual(uniq([1, 2, 3, 2, 4, 5, 3, 4, 5]), [1, 2, 3, 4, 5])
    })
  })
})
