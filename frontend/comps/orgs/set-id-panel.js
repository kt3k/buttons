const api = require('../../util/api')
const { component, on, wired } = require('capsid')
const User = require('../../../src/domain/user')

@component('set-id-panel')
class SetIdPanel {
  @wired('input')
  get input () {}

  @on.click.at('button')
  async requestApi () {
    const value = this.input.value

    if (!value) {
      alert('Empty id is not allowed')
      return
    }

    if (!User.isValidDisplayId(value)) {
      alert(`Invalid user id: ${value}`)
      alert(`You can use numbers (0-9) and lower case alphabets (a-z) for the id.
You can use _ and - in the middle of the id.`)
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
