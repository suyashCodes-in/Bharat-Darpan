const ApiError = require('../utils/ApiError');
const env = require('../config/env');

// 404 handler for unmatched routes.
function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

// Central error renderer. Maps ApiError + Mongoose + JWT errors to JSON.
function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  let status = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let details = err.details;

  // Mongoose validation
  if (err.name === 'ValidationError') {
    status = 400;
    message = 'Validation error';
    details = Object.values(err.errors).map((e) => ({
      path: e.path,
      message: e.message,
    }));
  } else if (err.name === 'CastError') {
    status = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.code === 11000) {
    status = 409;
    const fields = Object.keys(err.keyValue || {}).join(', ');
    message = `Duplicate value for: ${fields}`;
  } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    status = 401;
    message = 'Invalid or expired token';
  }

  if (status >= 500 && env.NODE_ENV === 'production') {
    message = 'Internal server error';
  }

  res.status(status).json({ message, ...(details ? { details } : {}) });
}

module.exports = { notFound, errorHandler };
