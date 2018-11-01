class Activity {
  constructor ({ id, type, user, button, info, date }) {
    this.id = id
    this.type = type
    this.user = user
    this.button = button
    this.info = info
    this.date = date
  }
}

Activity.PUSH = 'push' // When the user pushed the button
Activity.CREATE = 'create' // When the user created a new button
Activity.JOIN = 'join' // When the user joined the service

module.exports = Activity
