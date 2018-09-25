const { component, on, make, wired } = require('capsid')
const { Action } = require('../../const')

@component('main-buttons-area')
class MainButtonsArea {
  @wired('.button-area')
  get buttonArea () {}

  __mount__ () {
    this.el.innerHTML = `
      <div class="container">
        <p class="button-area"></p>
      </div>
    `
  }

  @on(Action.AUTH_READY)
  update ({ detail: user }) {
    console.log(user.buttons)

    for (const button of user.buttons) {
      this.createTheButton(button)
    }
  }

  /**
   * @param {Object} buttonObj
   */
  createTheButton (buttonObj) {
    const button = document.createElement('button')
    const buttonComponent = make('the-button', button)
    buttonComponent.update(buttonObj)
    this.buttonArea.appendChild(button)
    this.buttonArea.appendChild(new Text(' '))
  }
}

module.exports = MainButtonsArea
