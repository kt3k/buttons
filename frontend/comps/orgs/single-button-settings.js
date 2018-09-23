const { component, wired, on, unmount } = require('capsid')
const api = require('../../util/api')

@component('single-button-settings')
class SingleButtonSettings {
  @wired('.button-id')
  get idLabel () {}
  @wired('[name="name"]')
  get nameInput () {}
  @wired('[name="description"]')
  get descriptionTextarea () {}
  __mount__ () {
    this.el.innerHTML = `
      <p><small class="button-id has-text-grey-light has-text-weight-bold is-italic"></small></p>
      <div class="field is-grouped">
        <p class="control">
          <input class="input" name="name" placeholder="Name" />
        </p>
        <p class="control">
          <button class="button is-primary save-button">Save</button>
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

  @on.click.at('.save-button')
  async onSave () {
    await api('PUT', `/users/self/buttons/${this.id}`, {
      id: this.id,
      name: this.nameInput.value,
      description: this.descriptionTextarea.value,
      userId: this.userId
    })
  }

  @on.click.at('.delete-button')
  async onDelete () {
    await api('DELETE', `/users/self/buttons/${this.id}`)
    unmount('single-button-settings', this.el)
    this.el.parentElement.removeChild(this.el)
  }
}

module.exports = SingleButtonSettings
