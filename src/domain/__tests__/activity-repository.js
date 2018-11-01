const { describe, it, before } = require('kocha')
const { Activity, User } = require('..')
const assert = require('assert')

const userRepository = new User.Repository()
const repository = new Activity.Repository()

describe('ActivityRepository', () => {
  before(async () => {
    const user = await userRepository.getByDisplayId('foo')

    await repository.save(
      new Activity({
        type: Activity.PUSH,
        user,
        button: user.buttons[0],
        date: new Date(0),
        info: {}
      })
    )

    await repository.save(
      new Activity({
        type: Activity.CREATE,
        user,
        button: user.buttons[0],
        date: new Date(),
        info: {}
      })
    )
  })

  describe('getRecent', () => {
    it('gets the recent activities', async () => {
      const activities = await repository.getRecent()

      assert.strictEqual(activities.length, 2)
      assert(activities[0] instanceof Activity)
      assert.strictEqual(activities[0].user.displayId, 'foo')
      assert.strictEqual(activities[0].type, Activity.CREATE)
      assert(activities[1] instanceof Activity)
      assert.strictEqual(activities[1].user.displayId, 'foo')
      assert.strictEqual(activities[1].type, Activity.PUSH)
    })
  })
})
