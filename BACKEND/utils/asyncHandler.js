// Wraps an async Express handler so thrown errors / rejected promises
// are forwarded to the error-handling middleware instead of crashing
// the process or hanging the request.
module.exports = function asyncHandler(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
