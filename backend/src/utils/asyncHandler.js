// Wraps async route handlers so thrown errors propagate to the error middleware.
module.exports = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
