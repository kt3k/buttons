const { describe, it } = require('kocha')
const assert = require('assert')
const { User } = require('..')

describe('User', () => {
  describe('isValidDisplayId', () => {
    it('returns true when the display id is valid', () => {
      assert(User.isValidDisplayId('abc'))
      assert(User.isValidDisplayId('foo-bar'))
      assert(User.isValidDisplayId('0-1'))
      assert(User.isValidDisplayId('a-'))
      assert(User.isValidDisplayId('a-_'))
    })

    it('returns false when the display id is invalid', () => {
      assert(!User.isValidDisplayId('-aa'))
      assert(!User.isValidDisplayId('_aa'))
    })
  })
})
