const { component, wired, on } = require('capsid')
const { format } = require('date-fns')
const api = require('../../util/api')
const insertCss = require('insert-css')

insertCss(`
.the-button .sign-button {
  min-width: 50px;
}

.the-button .check-button {
  min-width: 120px;
}
`)

@component('the-button')
class TheButton {
  @wired('.check-button')
  get checkButton () {}

  @wired('.sign-button')
  get signButton () {}

  __mount__ () {
    this.el.innerHTML = `
      <span class="button sign-button">-</span>
      <span class="button check-button"></span>
    `
    this.el.classList.add('buttons', 'has-addons')
  }

  /**
   *
   * @param {Object} buttonObj
   * @param {Object} checkObj
   */
  update (buttonObj, checkObj) {
    this.checkButton.textContent = buttonObj.name
    this.checkButton.setAttribute('title', buttonObj.description)
    this.id = buttonObj.id
    this.toggleCheck(checkObj != null)
  }

  @on.click.at('.check-button.is-checked')
  async onClickChecked () {
    this.setLoading()

    await api('POST', `/users/self/buttons/${this.id}/uncheck`, {
      d: format(new Date(), 'YYYY-MM-DD')
    })

    this.toggleCheck(false)
  }

  @on.click.at('.check-button.is-unchecked')
  async onClickUnchecked () {
    this.setLoading()

    await api('POST', `/users/self/buttons/${this.id}/check`, {
      d: format(new Date(), 'YYYY-MM-DD')
    })

    this.toggleCheck(true)
  }

  setLoading () {
    this.checkButton.classList.remove('is-checked', 'is-unchecked')
  }

  toggleCheck (checked) {
    this.checkButton.classList.remove('is-loading')
    this.checkButton.classList.toggle('is-unchecked', !checked)
    this.checkButton.classList.toggle('is-checked', checked)
    this.checkButton.classList.toggle('is-info', checked)
    // this.signButton.classList.toggle('is-info', checked)
    this.signButton.textContent = checked ? '👍' : '🐹'
  }
}

module.exports = TheButton
