const DUMMY_HOST = 'http://localhost/'
exports.getPathname = relativeUrl => new URL(relativeUrl, DUMMY_HOST).pathname
