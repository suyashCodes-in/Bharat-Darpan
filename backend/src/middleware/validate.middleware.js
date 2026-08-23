const ApiError = require('../utils/ApiError');

// Runs zod schemas against the request and replaces the source with parsed data.
// Pass an object like { body, query, params } (any subset).
module.exports = (schemas) => (req, res, next) => {
  const errors = [];
  for (const key of ['body', 'query', 'params']) {
    if (schemas[key]) {
      const result = schemas[key].safeParse(req[key]);
      if (!result.success) {
        errors.push(
          ...result.error.issues.map((i) => ({
            source: key,
            path: i.path.join('.'),
            message: i.message,
          }))
        );
      } else {
        req[key] = result.data;
      }
    }
  }
  if (errors.length) return next(new ApiError(400, 'Validation failed', errors));
  next();
};
