const { ApiError } = require('../util/api')
const { parse, format, differenceInDays } = require('date-fns')
const { isValidDateStr } = require('../util/date')

exports.get = ({ checkRepository, userRepository }) => async (req, res) => {
  const id = req.params.id
  const from = req.query.from
  const to = req.query.to
  const d = req.query.d

  const user = await userRepository.getByDisplayId(id)
  const buttonIds = user.buttons.map(button => button.id)

  if (isValidDateStr(d)) {
    const checks = await checkRepository.getByButtonIdsAndDate(
      buttonIds,
      parse(d)
    )
    res.status(200).json(checks.checks.map(checkToApiResult))
    return
  }

  if (!isValidDateStr(from) || !isValidDateStr(to)) {
    throw new ApiError(`Bad from/to query: ${from}/${to}`, 400, 400)
  }

  const fromDate = parse(from)
  const toDate = parse(to)

  if (differenceInDays(from, to) > 400) {
    throw new ApiError(`Too long range: ${from}/${to}`, 400, 400)
  }

  const records = await checkRepository.getByButtonIdsAndDateRange(
    buttonIds,
    fromDate,
    toDate
  )
  res.status(200).json(records.map(recordToApiResult))
}

/**
 * @param {DailyCheckRecord}
 * @return {Object}
 */
const recordToApiResult = record => ({
  date: format(record.date, 'YYYY-MM-DD'),
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
