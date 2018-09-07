if (!process.env.API_ROOT) {
  throw new Error('process.env.API_ROOT is not set')
}

exports.API_ROOT = process.env.API_ROOT
exports.Action = require('./action')
