class ApiError extends Error {
  /**
   *
   * @param {string} message
   * @param {number} code
   * @param {number} status
   */
  constructor (message, code, status) {
    super(message)

    this.code = code
    this.status = status
  }
}

exports.ApiError = ApiError

const CODE_INTERNAL_SERVER_ERROR = 1

/**
 * @param {Function} handler Route handler
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @return {Function}
 */
exports.handleApiError = handler => async (req, res) => {
  try {
    await handler(req, res)
  } catch (e) {
    if (e instanceof ApiError) {
      res.status(e.status).json({
        message: e.message,
        code: e.code
      })

      return
    }

    console.log(e)

    // TODO: Logs this error in an appropriate way
    res.status(503).json({
      message: 'Internal Server Error',
      code: CODE_INTERNAL_SERVER_ERROR
    })
  }
}
