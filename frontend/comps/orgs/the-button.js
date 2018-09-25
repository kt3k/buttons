const { component } = require('capsid')

@component('the-button')
class TheButton {
  __mount__ () {
    this.el.classList.add('button', 'is-info')
  }

  /**
   *
   * @param {Object} buttonObj
   */
  update (buttonObj) {
    this.el.textContent = buttonObj.name
    this.el.setAttribute('title', buttonObj.description)
    this.id = buttonObj.id
    this.userId = buttonObj.userId
  }
}

module.exports = TheButton
