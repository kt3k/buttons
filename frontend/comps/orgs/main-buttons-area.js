const { component, on, make, wired } = require('capsid')
const format = require('date-fns/format')
const { Action } = require('../../const')
const api = require('../../util/api')

@component('main-buttons-area')
class MainButtonsArea {
  @wired('.button-area')
  buttonArea

  __mount__ () {
    this.el.innerHTML = `
      <div class="container">
        <p class="button-area"></p>
      </div>
    `
  }

  @on(Action.AUTH_READY)
  async update ({ detail: user }) {
    if (!user) {
      return
    }

    const checks = await this.fetchChecks(user.displayId)

    // eslint-disable-next-line
    for (const button of user.buttons) {
      const check = checks.find(check => check.buttonId === button.id)
      this.createTheButton(button, check)
    }
  }

  /**
   * @param {Object} buttonObj
   * @param {Object} checkObj
   */
  createTheButton (buttonObj, checkObj) {
    const button = document.createElement('div')
    const buttonComponent = make('the-button', button)
    button.dataset.id = buttonObj.id
    buttonComponent.update(buttonObj, checkObj)
    this.buttonArea.appendChild(button)
  }

  async fetchChecks (displayId) {
    const today = format(new Date(), 'YYYY-MM-DD')
    const { data: checks } = await api(
      'GET',
      `/users/${displayId}/checks?d=${today}`
    )

    return checks
  }
}

module.exports = MainButtonsArea
