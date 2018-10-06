const { component, wired } = require('capsid')
const api = require('../../util/api')
const { getDisplayId } = require('../../util/path')

@component('user-profile')
class UserProfile {
  @wired('.user-picture')
  get picture () {}
  @wired('.user-display-name')
  get displayNameLabel () {}
  @wired('.user-display-id')
  get displayIdLabel () {}
  async __mount__ () {
    const id = getDisplayId(location, false)

    const { data: user } = await api('GET', `/users/${id}`)

    this.picture.src = user.picture
    this.displayNameLabel.textContent = user.displayName
    this.displayIdLabel.textContent = user.displayId
  }
}

module.exports = UserProfile
