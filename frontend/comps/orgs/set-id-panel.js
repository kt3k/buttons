const api = require('../../util/api')
const { component, on, wired } = require('capsid')

@component('set-id-panel')
class SetIdPanel {
  @wired('input')
  get input () {}

  @on.click.at('button')
  async requestApi () {
    const value = this.input.value

    if (!value) {
      alert('empty id is not allowed')
      return
    }

    try {
      await api('put', '/users/self/id', { id: this.input.value })
      alert('ok!')
      location.href = '/set-buttons.html'
    } catch (e) {
      console.log(e)
      alert("something's wrong. Try again")
    }
  }
}

module.exports = SetIdPanel
