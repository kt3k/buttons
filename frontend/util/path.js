const { parse } = require('query-string')

/**
 * @param {Location} location
 * @param {boolean} [isProduction=false]
 * @return {string} The user's displayId
 */
exports.getDisplayId = (location, isProduction = false) => {
  if (isProduction) {
    return // Returns :user in /:user
  }

  return parse(location.search).user
}

/**
 * @param {string} displayId
 * @return {string}
 */
exports.createProfilePath = (displayId, isProduction = false) => {
  if (isProduction) {
    return `/${displayId}`
  }

  return `/profile.html?user=${displayId}`
}
