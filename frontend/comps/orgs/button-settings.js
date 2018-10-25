const { wired, component, on, make } = require('capsid')
const api = require('../../util/api')

@component('button-settings')
class ButtonSettings {
  @wired('h2')
  get titleArea () {}
  @wired('.single-settings-area')
  get singleSettingsArea () {}

  async __mount__ () {
    const { data: buttons } = await api('GET', '/users/self/buttons')

    this.el.innerHTML = `
      <a class="button" href="./">Back</a>
      <h2></h2>
      <hr />
      <div class="single-settings-area"></div>
      <button class="button is-primary create-button">Create a new button</button>
    `
    this.updateTitle(buttons)

    buttons.forEach(buttonObj => {
      this.appendSingleButtonSettings(buttonObj)
    })
  }

  updateTitle (buttons) {
    this.titleArea.textContent = `${buttons.length} button(s)`
  }

  appendSingleButtonSettings (buttonObj) {
    const settings = make(
      'single-button-settings',
      document.createElement('div')
    )

    this.singleSettingsArea.appendChild(settings.el)

    settings.update(buttonObj)
  }

  @on.click.at('.create-button')
  async onCreate () {
    const { data: button } = await api('POST', '/users/self/buttons')
    this.appendSingleButtonSettings(button)
  }
}

module.exports = ButtonSettings
