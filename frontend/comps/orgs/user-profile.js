const { component, wired, make, on } = require('capsid')
const { today, yearAgo } = require('../../util/date')
const api = require('../../util/api')
const { Action } = require('../../const')

@component('user-profile')
class UserProfile {
  @wired.component('cal-heatmap')
  get heatmap () {}

  __mount__ () {
    const heatmap = make('cal-heatmap', document.createElement('div'))

    this.el.appendChild(heatmap.el)
  }

  @on(Action.FILL_USER)
  async onUser ({ detail: user }) {
    const { data: records } = await api(
      'get',
      `/users/${user.id}/checks?from=${yearAgo}&to=${today}`
    )

    this.heatmap.update({ detail: { user, records } })
  }
}

module.exports = UserProfile
