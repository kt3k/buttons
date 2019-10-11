const { parseISO, isValid } = require('date-fns')

const RE_DATE = /^\d\d\d\d-\d\d-\d\d$/

exports.isValidDateStr = str => RE_DATE.test(str) && isValid(parseISO(str))
