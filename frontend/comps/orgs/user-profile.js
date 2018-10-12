const { component, on, wired, notifies } = require('capsid')
const api = require('../../util/api')
const { getDisplayId } = require('../../util/path')
const { Action } = require('../../const')
const genel = require('genel')
const insertCss = require('insert-css')

const forEach = [].forEach
const map = [].map
const SELECTED_CLASS = 'is-danger'

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

  @wired.all('.check-button')
  get checkButtons () {}
  @wired.all('.sign-button')
  get signButtons () {}

  @wired.all(`.check-button.${SELECTED_CLASS}`)
  get selectedCheckButtons () {}
  @wired.all(`.sign-button.${SELECTED_CLASS}`)
  get selectedSignButtons () {}

  @wired.component('user-heatmap')
  get userHeatmap () {}

  @wired('.user-profile-buttons-area')
  get buttonsArea () {}

  async __mount__ () {
    const id = getDisplayId(location, false)

    const { data: user } = await api('GET', `/users/${id}`)

    this.picture.src = user.picture
    this.displayNameLabel.textContent = user.displayName
    this.displayIdLabel.textContent = user.displayId

    this.fillButtons(user.buttons)

    setTimeout(() => {
      this.fillUserHeatmap(user)
    }, 100)
  }

  @notifies(Action.FILL_USER, '.user-heatmap')
  fillUserHeatmap (user) {
    return user
  }

  toggleButtonState (el, toggle) {
    el.parentElement
      .querySelector('.check-button')
      .classList.toggle(SELECTED_CLASS, toggle)
    el.parentElement
      .querySelector('.sign-button')
      .classList.toggle(SELECTED_CLASS, toggle)
  }

  removeSelection () {
    forEach.call(this.selectedCheckButtons, el => {
      el.classList.remove(SELECTED_CLASS)
    })

    forEach.call(this.selectedSignButtons, el => {
      el.classList.remove(SELECTED_CLASS)
    })
  }

  @on.click.at('.check-button')
  toggleButtonFilter ({ target }) {
    const toggle = !target.classList.contains(SELECTED_CLASS)

    this.removeSelection()

    this.toggleButtonState(target, toggle)
    this.updateButtonFilter()
  }

  @on.click.at('.sign-button')
  toggleButtonFilterMode ({ target }) {
    this.toggleButtonState(target)
    this.updateButtonFilter()
  }

  @notifies(Action.TOGGLE_BUTTON_FILTER, '.user-heatmap')
  updateButtonFilter () {
    return {
      buttonIds: map.call(this.selectedCheckButtons, el => el.dataset.buttonId)
    }
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
                <span class="button check-button" data-button-id="${
  button.id
}">${button.name}</span>
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
