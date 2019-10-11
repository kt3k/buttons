const format = require('date-fns/format')
const subYears = require('date-fns/subYears')

const now = Date.now()
exports.now = now
exports.today = format(now, 'yyyy-MM-dd')
exports.yearAgo = format(subYears(now, 1), 'yyyy-MM-dd')
