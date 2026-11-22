const ApiError = require('../utils/ApiError');

function notFound(req, res) {
  res.status(404).json({ success: false, message: 'Route not found' });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }

  // MySQL duplicate key
  if (err && err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ success: false, message: 'That value is already in use.' });
  }

  // MySQL FK violation
  if (err && err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({ success: false, message: 'Related record does not exist.' });
  }

  console.error('[error]', err);
  // Never leak stack traces, SQL, or secrets to the client.
  res.status(500).json({ success: false, message: 'Internal server error' });
}

module.exports = { notFound, errorHandler };
