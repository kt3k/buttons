const mongoose = require('mongoose')

if (!process.env.MONGODB) {
  throw new Error('process.env.MONGODB is not set')
}

mongoose.connect(process.env.MONGODB, { useNewUrlParser: true })
const db = mongoose.connection

module.exports = db
