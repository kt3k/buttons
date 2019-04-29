require('./db')
const { User, Button, Check, Activity } = require('../../domain')

const services = {
  User,
  userRepository: new User.Repository(),
  userInitService: new User.InitService(),
  userButtonService: new User.ButtonService(),
  buttonRepository: new Button.Repository(),
  checkRepository: new Check.Repository(),
  checkService: new Check.Service(),
  activityRepository: new Activity.Repository(),
  activityService: new Activity.Service()
}

module.exports = services
