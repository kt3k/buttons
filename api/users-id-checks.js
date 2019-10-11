const { parseISO, format, differenceInDays } = require('date-fns')
const { isValidDateStr } = require('../util/date')
const { ApiError, wrap, getPathname } = require('./util')
const { query, match, send } = require('./util/micro')
const { checkRepository, userRepository } = require('./util/services')
const { CODE_BAD_REQUEST } = require('./util/error-code')

async function get (req, res) {
  const { id } = match('/users/:id/checks', getPathname(req.url))
  const { from, to, d } = query(req)

  const user = await userRepository.getByDisplayId(id)
  const buttonIds = user.buttons.map(button => button.id)

  if (isValidDateStr(d)) {
    const checks = await checkRepository.getByButtonIdsAndDate(
      buttonIds,
      parseISO(d)
    )
    send(res, 200, checks.checks.map(checkToApiResult))
    return
  }

  if (!isValidDateStr(from) || !isValidDateStr(to)) {
    throw new ApiError(
      `Bad from/to query: ${from}/${to}`,
      CODE_BAD_REQUEST,
      400
    )
  }

  const fromDate = parseISO(from)
  const toDate = parseISO(to)

  if (differenceInDays(fromDate, toDate) > 400) {
    throw new ApiError(`Too long range: ${from}/${to}`, CODE_BAD_REQUEST, 400)
  }

  const records = await checkRepository.getByButtonIdsAndDateRange(
    buttonIds,
    fromDate,
    toDate
  )

  send(res, 200, records.map(recordToApiResult))
}

/**
 * @param {DailyCheckRecord}
 * @return {Object}
 */
const recordToApiResult = record => ({
  date: format(record.date, 'yyyy-MM-dd'),
  checks: record.checks.checks.map(checkToApiResult)
})

/**
 * @param {Check}
 * @return {Object}
 */
const checkToApiResult = check => {
  const result = { buttonId: check.buttonId }

  if (check.note) {
    result.note = check.note
  }

  return result
}

module.exports = wrap({ get })
