const { component, wired } = require('capsid')
const api = require('../../util/api')
const { getDisplayId } = require('../../util/path')
const genel = require('genel')
const insertCss = require('insert-css')

insertCss(`
  .user-profile .sign-button {
    width: 50px;
  }
  .user-profile .check-button {
    min-width: 120px;
  }
`)

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
      this.buttonsArea.innerHTML = `
        <div class="card">
          <div class="card-content">
            <div class="content">
              No buttons
            </div>
          </div>
        </div>
      `
    }

    buttons.forEach(button => {
      const div = genel.div`
        <div class="card-content">
          <div class="media">
            <div class="media-left">
              <div class="buttons has-addons">
                <span class="button sign-button">🌴</span>
                <span class="button check-button">${button.name}</span>
              </div>
            </div>
          </div>
          <div class="content">
            ${button.description}
          </div>
        </div>
      `
      div.classList.add('card')

      this.buttonsArea.appendChild(div)
    })
  }
}

module.exports = UserProfile
