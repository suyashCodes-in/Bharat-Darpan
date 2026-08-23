const ApiError = require('../utils/ApiError');

// Allows access only if req.user.role is in the provided list.
module.exports = (...allowed) => (req, res, next) => {
  if (!req.user) throw new ApiError(401, 'Not authenticated');
  if (!allowed.includes(req.user.role)) {
    throw new ApiError(403, `Forbidden — requires one of: ${allowed.join(', ')}`);
  }
  next();
};
