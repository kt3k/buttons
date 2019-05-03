require('@babel/register')

const { before, after } = require('kocha')
const db = require('./util/db')

const dbUrl = process.env.MONGODB
const isTestDatabase = () => /test-buttons-backend/.test(dbUrl)

const { User, userButtonService, userRepository } = require('./util/services')

before(done => {
  console.log(`connecting to mongodb: ${dbUrl}`)

  db.on('open', async () => {
    if (!isTestDatabase()) {
      throw new Error(`Cannot run tests against non test database: ${dbUrl}`)
    }

    const user = new User({
      picture: 'https://example.com/avatar.png',
      authId: 'github|123',
      authData: {},
      displayId: 'foo',
      displayName: 'Buzz Foobar',
      buttons: []
    })

    await userRepository.save(user)
    const user0 = await userRepository.getByAuthId('github|123')

    await userButtonService.createButton(user0, {
      name: 'Plants',
      description: 'Water the plants'
    })

    await userButtonService.createButton(user0, {
      name: 'Milk',
      description: 'Buy the plants'
    })

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

/**
 * payload {
 *   "sub": "1234567890",
 *   "name": "John Doe",
 *   "iat": 1516239022
 * }
 */
exports.token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

/**
 * The default headers for testing.
 */
exports.headers = {
  authorization: `Bearer ${exports.token}`
}

/**
 * payload {
 *   "sub": "github|123",
 *   "name": "Buzz Foobar"
 * }
 */
exports.ghToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJnaXRodWJ8MTIzIiwibmFtZSI6IkJ1enogRm9vYmFyIn0.Am-vzXJ7ZpoiyH8IdBbxufyohs8EgiIZkqMJ957li0c'
exports.ghHeaders = {
  authorization: `Bearer ${exports.ghToken}`
}
