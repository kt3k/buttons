const { component, wired, make, on } = require('capsid')
const { today, yearAgo } = require('../../util/date')
const api = require('../../util/api')
const { Action } = require('../../const')
const insertCss = require('insert-css')

insertCss(`
.user-heatmap {
  padding: 3rem 0;
  margin: 0 1.5rem;
  overflow: scroll;
}
`)

@component('user-heatmap')
class UserHeatmap {
  @wired.component('cal-heatmap')
  get heatmap () {}

  __mount__ () {
    const heatmap = make('cal-heatmap', document.createElement('div'))

    this.el.appendChild(heatmap.el)

    setTimeout(() => {
      this.el.scrollLeft = 1000
    })
  }

  @on(Action.FILL_USER)
  async onUser ({ detail: user }) {
    if (!user) {
      return
    }

    const { data: records } = await api(
      'get',
      `/users/${user.id}/checks?from=${yearAgo}&to=${today}`
    )

    this.heatmap.update({ detail: { user, records } })
  }
}

module.exports = UserHeatmap
