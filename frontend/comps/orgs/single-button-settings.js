const { component, wired, on, unmount } = require('capsid')
const api = require('../../util/api')

@component('single-button-settings')
class SingleButtonSettings {
  @wired('.button-id')
  idLabel

  @wired('[name="name"]')
  nameInput

  @wired('[name="description"]')
  descriptionTextarea

  @wired('.save-button')
  saveButton

  @wired('.delete-button')
  deleteButton

  __mount__ () {
    this.el.innerHTML = `
      <p><small class="button-id has-text-grey-light has-text-weight-bold is-italic"></small></p>
      <div class="field is-grouped">
        <p class="control">
          <input class="input" name="name" placeholder="Name" />
        </p>
        <p class="control">
          <button class="button save-button">Save</button>
        </p>
        <p class="control">
          <button class="button is-danger delete-button">Delete</button>
        </p>
      </div>
      <textarea class="textarea" placeholder="Description of the button" name="description"></textarea>
      <hr />
    `
  }

  /**
   * Updates by the given button object.
   * @param {Object} button
   */
  update (button) {
    this.idLabel.textContent = `ID: ${button.id}`
    this.nameInput.value = button.name
    this.descriptionTextarea.value = button.description
    this.id = button.id
    this.userId = button.userId
  }

  startLoading (el) {
    el.classList.toggle('is-loading', true)
  }

  stopLoading (el) {
    el.classList.toggle('is-primary', false)
    el.classList.toggle('is-loading', false)
  }

  @on('input', { at: 'input, textarea' })
  onInput () {
    this.saveButton.classList.toggle('is-primary', true)
  }

  @on.click.at('.save-button')
  async onSave () {
    this.startLoading(this.saveButton)
    await api('PUT', `/users/self/buttons/${this.id}`, {
      id: this.id,
      name: this.nameInput.value,
      description: this.descriptionTextarea.value,
      userId: this.userId
    })
    this.stopLoading(this.saveButton)
  }

  @on.click.at('.delete-button')
  async onDelete () {
    if (!confirm(`Are you sure you want to delete "${this.nameInput.value}"`)) {
      return
    }
    this.startLoading(this.deleteButton)
    await api('DELETE', `/users/self/buttons/${this.id}`)
    this.stopLoading(this.deleteButton)
    this.el.parentElement.removeChild(this.el)
    unmount('single-button-settings', this.el)
  }
}

module.exports = SingleButtonSettings
