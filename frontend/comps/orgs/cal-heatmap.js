const { component, wired } = require('capsid')
const Cal = require('cal-heatmap')
const { subMonths } = require('date-fns')

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
      tooltip: true
    })
  }

  update () {}
}

module.exports = CalHeatmap
