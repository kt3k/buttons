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

  @wired('.user-profile-buttons-area')
  get buttonsArea () {}

  async __mount__ () {
    const id = getDisplayId(location, false)

    const { data: user } = await api('GET', `/users/${id}`)

    this.picture.src = user.picture
    this.displayNameLabel.textContent = user.displayName
    this.displayIdLabel.textContent = user.displayId

    this.fillButtons(user.buttons)
  }

  fillButtons (buttons) {
    if (buttons.length === 0) {
      this.buttonsArea.textContent = 'No buttons'
    }

    buttons.forEach(button => {
      const p = document.createElement('p')
      const span = document.createElement('span')
      span.classList.add('button')
      span.textContent = button.name
      p.appendChild(span)
      this.buttonsArea.appendChild(p)
      if (button.description) {
        const p = document.createElement('p')
        p.textContent = button.description
        this.buttonsArea.appendChild(p)
      }
    })
  }
}

module.exports = UserProfile
