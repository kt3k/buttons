const { ApiError } = require('../util/api')
const { parse } = require('date-fns')

exports.get = ({ checkRepository, userRepository }) => async (req, res) => {
  const id = req.params.id
  const from = req.query.from
  const to = req.query.to
  const d = req.query.d

  const user = await userRepository.getById(id)
  const buttonIds = user.buttons.map(button => button.id)

  if (d) {
    const checks = await getByDate(buttonIds, parse(d), checkRepository)
    res.status(200).json(checks.checks)
    return
  }

  if (/YYYY-MM-DD/.test(from)) {
    // TODO: impelemnt
    throw new ApiError(`Bad from/to query: ${from}/${to}`, 400, 400)
  }

  const checkRange = await getByDateRange(buttonIds, parse(from), parse(to))
  res.status(200).json(checkRange)
}

const getByDate = async (buttonIds, date, checkRepository) => {
  return checkRepository.getByButtonIdsAndDate(buttonIds, date)
}

const getByDateRange = async (buttonIds, from, to, checkRepository) => {
  // TODO implement this
  return checkRepository.getByButtonIdsAndDateRange(buttonIds, from, to)
}
