const { component, wired } = require('capsid')
const api = require('../../util/api')
const { createProfilePath } = require('../../util/path')
const genel = require('genel')
const { CHECKED, BUTTON_CREATED } = require('../../const/sign')
const distanceInWords = require('date-fns/distance_in_words')

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

    if (!buttonName || !displayId) {
      return
    }

    const p = genel.p`
      ${CHECKED}
      ${this.constructor.createUserHtml(displayId)}
      pushed
      <strong class="button-name"></strong>
      ${this.constructor.createDateHtml(activity.date)}
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
      ${BUTTON_CREATED}
      ${this.constructor.createUserHtml(displayId)}
      created
      <strong class="button-name"></strong>
      ${this.constructor.createDateHtml(activity.date)}
    `
    p.querySelector('.button-name').textContent = `${buttonName}`

    return p
  }

  static createUserHtml (displayId) {
    return `
      <a href="${createProfilePath(displayId)}">
        <strong class="user-display-id">@${displayId}</strong></a>
    `
  }

  /**
   * @param {string} date The date in string format
   * @return {string} The html
   */
  static createDateHtml (date) {
    const distance = distanceInWords(new Date(), Date.parse(date), {
      addSuffix: true
    })

    return `<small class="has-text-grey">${distance}</small>`
  }
}

module.exports = ActivityFeed
