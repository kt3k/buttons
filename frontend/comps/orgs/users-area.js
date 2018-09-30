const { component, wired } = require('capsid')
const api = require('../../util/api')

@component('users-area')
class UsersArea {
  @wired('.user-list')
  get userList () {}

  async __mount__ () {
    const { data: users } = await api('GET', '/users')

    users.forEach(user => {
      this.createItem(user)
    })
  }

  createItem (user) {
    const li = document.createElement('li')
    const a = document.createElement('a')
    a.href = '/' + user.displayId
    a.textContent = user.displayId
    li.appendChild(a)
    this.userList.appendChild(li)
  }
}

module.exports = UsersArea
