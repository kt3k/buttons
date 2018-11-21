const format = require('date-fns/format')
const subYears = require('date-fns/sub_years')

const now = Date.now()
exports.now = now
exports.today = format(now, 'YYYY-MM-DD')
exports.yearAgo = format(subYears(now, 1), 'YYYY-MM-DD')
