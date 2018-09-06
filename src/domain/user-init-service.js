const UserRepository = require('./user-repository')
const User = require('./user')

const repository = new UserRepository()

class UserInitService {
  /**
   * Gets the user if they exist, or creates the user
   * @param {Object} authData The data from auth0 id_token
   * @return {Promise<User>}
   */
  async getOrCreate(authData) {
    if (!authData || !authData.sub) {
      throw new Error('authData.sub is not defined')
    }

    const user = await repository.getByAuthId(authData.sub)

    if (user) {
      return user
    }

    return this.createUser(authData)
  }

  async createUser(authData) {
    const authId = authData.sub
    const user = new User({
      picture: authData.picture,
      displayId: null,
      displayName: authData.name,
      authId,
      authData,
      buttons: []
    })

    await repository.save(user)

    return repository.getByAuthId(authId)
  }
}

module.exports = UserInitService
