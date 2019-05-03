const { userToUserDto, wrap } = require('./util')
const { userRepository } = require('./util/services')
const { send } = require('./util/micro')

/** Gets the users */
async function get (req, res) {
  const users = await userRepository.getMany()

  send(res, 200, users.map(userToUserDto))
}

module.exports = wrap({ get })
