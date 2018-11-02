const { component, wired } = require('capsid')
const api = require('../../util/api')
const { createProfilePath } = require('../../util/path')
const genel = require('genel')
const { CHECKED, BUTTON_CREATED } = require('../../const/sign')

@component('activity-feed')
class ActivityFeed {
  @wired('.activity-list')
  get list () {}

  async __mount__ () {
    const { data: activities } = await api('GET', '/activities/recent')

    activities.push({
      type: 'create',
      user: { displayId: 'foo' },
      button: { name: 'v8' }
    })
    activities.push({
      type: 'push',
      user: { displayId: 'bar' },
      button: { name: 'c3' }
    })

    activities.forEach(activity => {
      const el = this.createActivityItem(activity)

      if (el) {
        this.list.appendChild(el)
      }
    })
  }

  createActivityItem (activity) {
    switch (activity.type) {
      case 'push': {
        return this.createPushActivityItem(activity)
      }
      case 'create': {
        return this.createCreateActivityItem(activity)
      }
      default:
    }
  }

  createPushActivityItem (activity) {
    const displayId = activity.user.displayId
    const buttonName = activity.button.name

    if (!buttonName || !displayId) {
      return
    }

    const p = genel.p`
      ${CHECKED} <a href="${createProfilePath(
  displayId
)}"><strong class="user-display-id">@${displayId}</strong></a> pushed <strong class="button-name"></strong>.
    `

    p.querySelector('.button-name').textContent = `${buttonName}`
    return p
  }

  createCreateActivityItem (activity) {
    const displayId = activity.user.displayId
    const buttonName = activity.button.name

    if (!buttonName || !displayId) {
      return
    }

    const p = genel.p`
      ${BUTTON_CREATED} <a href="${createProfilePath(
  displayId
)}"><strong class="user-display-id">@${displayId}</strong></a> created <strong class="button-name"></strong>.
    `
    p.querySelector('.button-name').textContent = `${buttonName}`

    return p
  }
}

module.exports = ActivityFeed
