exports.corsOk = (req, res, next) => {
  res.append('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN)
  res.append('Access-Control-Allow-Headers', 'Authorization,Content-Type')
  next()
}

exports.allowMethods = methods => (req, res, next) => {
  res.append('Access-Control-Allow-Methods', methods)
  next()
}

exports.ok = (req, res) => {
  res.status(200).send()
}
