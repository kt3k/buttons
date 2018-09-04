const { before, after } = require('kocha')
const db = require('../util/db')

before(done => {
  console.log(`connecting to mongodb: ${process.env.MONGODB}`)
  db.on('open', () => {
    done()
  })
})

after(() => {
  console.log(`disconnecting from mongodb: ${process.env.MONGODB}`)
  db.close()
})
