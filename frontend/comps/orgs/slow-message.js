const { component } = require('capsid')
const api = require('../../util/api')
const insertCss = require('insert-css')

insertCss(`
.slow-message {
  opacity: 0;
  visibility: hidden;
  transition-duration: 500ms;
}

.slow-message.is-visible {
  opacity: 1;
  visibility: visible;
}
`)

@component('slow-message')
class SlowMessage {
  async __mount__ () {
    this.el.style.display = ''
    this.showAfter(2000)

    await api('GET', '/')

    this.el.classList.remove('is-visible')

    setTimeout(() => {
      this.el.parentElement.removeChild(this.el)
    }, 500)
  }

  showAfter (milliseconds) {
    setTimeout(() => {
      this.el.classList.add('is-visible')
    }, milliseconds)
  }
}

module.exports = SlowMessage
