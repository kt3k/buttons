const { format, subYears } = require('date-fns')

const now = Date.now()
exports.now = now
exports.today = format(now, 'YYYY-MM-DD')
exports.yearAgo = format(subYears(now, 1), 'YYYY-MM-DD')
