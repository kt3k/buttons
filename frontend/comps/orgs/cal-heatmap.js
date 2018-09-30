const { component, wired } = require('capsid')
const Cal = require('cal-heatmap')
const { subMonths, parse } = require('date-fns')

@component('cal-heatmap')
class CalHeatmap {
  @wired('.cal-heatmap')
  get calHeatmap () {}

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

  update ({ detail: { user, records } }) {
    const data = {}

    records.forEach(record => {
      data[parse(record.date).valueOf() / 1000] = record.checks.length
    })

    const legend = user.buttons.map((_, i) => i + 0.5)
    legend.shift()

    // Note: if there are 4 buttons, legend is [1.5, 2.5, 3.5]
    // This makes 0, 1, 2, 3, and 4 checks in all different colors.

    this.cal.setLegend(legend)
    this.cal.update(data)
  }
}

module.exports = CalHeatmap
