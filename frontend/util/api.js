const axios = require('axios')
const { API_ROOT } = require('../const')

module.exports = (method, endpoint, data) => {
  const Authorization = `Bearer ${localStorage.access_token}`
  return axios({
    method,
    url: `${API_ROOT}${endpoint}`,
    data,
    headers: { Authorization }
  })
}
