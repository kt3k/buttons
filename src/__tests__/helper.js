require('@babel/register')

const { before, after } = require('kocha')
const db = require('../util/db')

const dbUrl = process.env.MONGODB
const isTestDatabase = () => /test-buttons-backend/.test(dbUrl)

const { User } = require('../domain')

before(done => {
  console.log(`connecting to mongodb: ${dbUrl}`)

  db.on('open', async () => {
    if (!isTestDatabase()) {
      throw new Error(`Cannot run tests against non test database: ${dbUrl}`)
    }

    await new User.Repository().save(
      new User({
        picture: 'https://example.com/avatar.png',
        authId: 'github|123',
        authData: {},
        displayId: 'foo',
        displayName: 'Buzz Foobar',
        buttons: []
      })
    )

    done()
  })
})

after(async () => {
  console.log(`disconnecting from mongodb: ${dbUrl}`)

  if (isTestDatabase()) {
    await db.db.dropDatabase()
  }

  await db.close()
})
