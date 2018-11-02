const { component, wired } = require('capsid')
const api = require('../../util/api')
const { createProfilePath } = require('../../util/path')
const genel = require('genel')
const { CHECKED, BUTTON_CREATED } = require('../../const/sign')
const format = require('date-fns/format')

@component('activity-feed')
class ActivityFeed {
  @wired('.activity-list')
  get list () {}

  async __mount__ () {
    const { data: activities } = await api('GET', '/activities/recent')

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
    const date = format(Date.parse(activity.date), 'YYYY-MM-DD hh:mm')

    if (!buttonName || !displayId) {
      return
    }

    const p = genel.p`
      ${CHECKED}
      <a href="${createProfilePath(displayId)}">
        <strong class="user-display-id">@${displayId}</strong></a>
      pushed
      <strong class="button-name"></strong>
      <small class="has-text-grey">${date}</small>
    `

    p.querySelector('.button-name').textContent = `${buttonName}`
    return p
  }

  createCreateActivityItem (activity) {
    const displayId = activity.user.displayId
    const buttonName = activity.button.name
    const date = format(Date.parse(activity.date), 'YYYY-MM-DD hh:mm')

    if (!buttonName || !displayId) {
      return
    }

    const p = genel.p`
      ${BUTTON_CREATED}
      <a href="${createProfilePath(displayId)}">
        <strong class="user-display-id">@${displayId}</strong></a>
      created
      <strong class="button-name"></strong>
      <small class="has-text-grey">${date}</small>
    `
    p.querySelector('.button-name').textContent = `${buttonName}`

    return p
  }
}

module.exports = ActivityFeed
