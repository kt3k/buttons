const { send } = require('./util/micro')
const { wrap } = require('./util')

async function get (req, res) {
  send(res, 200)
}

module.exports = wrap({ get })
