const { component, wired, on } = require('capsid')
const { Action } = require('../../const')
const api = require('../../util/api')

@component('profile-settings')
class ProfileSettings {
  @wired('input[name="display-name"]')
  get displayNameInput () {}
  @wired('.display-name-save-button')
  get displayNameSaveButton () {}

  __mount__ () {
    this.el.innerHTML = `
      <h2>Profile</h2>
      <p clsas="has-text-grey">Full Name</p>
      <div class="field is-grouped">
        <p class="control">
          <input class="input" name="display-name" placeholder="Full Name" />
        </p>
        <p class="control">
          <button class="button save-button display-name-save-button">Save</button>
        </p>
      </div>
      <p clsas="has-text-grey">Bio (coming soon)</p>
      <div class="field">
        <p class="control">
          <textarea class="textarea" disabled placeholder="bio">Bio (coming soon)</textarea>
        </p>
      </div>
      <div class="field is-grouped">
        <p class="control">
          <button class="button save-button" disabled>Save</button>
        </p>
      </div>
    `

    this.el.classList.add('auth-observer')
  }

  @on(Action.AUTH_READY)
  onUser ({ detail: user }) {
    this.displayName = user.displayName || ''
    this.displayNameInput.value = this.displayName
  }

  @on('input', { at: 'input[name="display-name"]' })
  onInputDisplayName () {
    this.displayNameSaveButton.classList.toggle(
      'is-primary',
      this.displayName !== this.displayNameInput.value
    )
  }

  startLoading (el) {
    el.classList.toggle('is-loading', true)
  }

  stopLoading (el) {
    el.classList.toggle('is-primary', false)
    el.classList.toggle('is-loading', false)
  }

  @on('click', { at: '.display-name-save-button' })
  async onClickDisplayNameSave () {
    this.startLoading(this.displayNameSaveButton)
    const displayName = this.displayNameInput.value
    try {
      await api('PUT', `/users/self`, { displayName })
    } catch (e) {
      alert("something's wrong")
    }
    this.stopLoading(this.displayNameSaveButton)
  }
}

module.exports = ProfileSettings
