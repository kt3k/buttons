const { component, wired } = require('capsid')
const Cal = require('cal-heatmap')
const subMonths = require('date-fns/subMonths')
const parseISO = require('date-fns/parseISO')

@component('cal-heatmap')
class CalHeatmap {
  @wired('.cal-heatmap') calHeatmap

  __mount__ () {
    this.el.innerHTML = `
      <div class="cal-heatmap"></div>
    `

    this.cal = new Cal()
    this.cal.init({
      itemSelector: this.calHeatmap,
      domain: 'month',
      subDomain: 'day',
      start: subMonths(new Date(), 11),
      legendHorizontalPosition: 'right',
      tooltip: true
    })

    this.cal.setLegend([1])
  }

  getButtonIds (buttons) {
    const ids = {}

    buttons.forEach(button => {
      ids[button.id] = true
    })

    return ids
  }

  /**
   * Sets the max count of data.
   * @param {numbr} buttonCount
   */
  setMaxCount ({ detail: buttonCount }) {
    // Note: if there are 4 buttons, legend is [1.5, 2.5, 3.5]
    // This makes 0, 1, 2, 3, and 4 checks in all different colors.
    const legend = []
    for (let i = 1.5; i < buttonCount; i += 1) {
      legend.push(i)
    }

    if (legend.length === 0) {
      this.cal.removeLegend()
    } else {
      this.cal.showLegend()
    }

    this.cal.setLegend(legend)
  }

  /**
   * @param {Button[]} buttons
   * @param {number} buttonCount
   * @param {Record[]} records
   */
  update ({ detail: { buttons, buttonCount, records } }) {
    const data = {}
    const buttonIds = this.getButtonIds(buttons)

    records.forEach(record => {
      const count = record.checks.filter(check => buttonIds[check.buttonId])
        .length
      if (count > 0) {
        data[parseISO(record.date).valueOf() / 1000] = count
      }
    })

    this.cal.update({})
    setTimeout(() => {
      this.cal.update(data)
    }, 100)
  }
}

module.exports = CalHeatmap
