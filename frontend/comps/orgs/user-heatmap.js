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
    this.filterButtonIds = new Set()
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
      `/users/${user.displayId}/checks?from=${yearAgo}&to=${today}`
    )

    this.user = user
    this.records = records

    this.heatmap.setMaxCount({ detail: user.buttons.length })

    this.updateHeatmap()
  }

  @on(Action.TOGGLE_BUTTON_FILTER)
  onToggleButtonFilter ({ detail: { buttonIds } }) {
    this.filterButtonIds = new Set(buttonIds)

    if (this.records) {
      // records are ready
      this.updateHeatmap()
    }
  }

  /**
   * Updates the heatmap with the current records and button filter.
   */
  updateHeatmap () {
    this.heatmap.update({
      detail: { buttons: this.getFilteredButtons(), records: this.records }
    })
  }

  getFilteredButtons () {
    if (this.filterButtonIds.size === 0) {
      return this.user.buttons
    } else {
      return this.user.buttons.filter(button =>
        this.filterButtonIds.has(button.id)
      )
    }
  }
}

module.exports = UserHeatmap
