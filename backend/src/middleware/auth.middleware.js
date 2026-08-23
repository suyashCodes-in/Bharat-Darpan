const { verifyToken } = require('../utils/token');
const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// Verifies a Bearer JWT and attaches the user to req.user.
module.exports = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    throw new ApiError(401, 'Missing or invalid Authorization header');
  }
  const token = header.split(' ')[1];
  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    throw new ApiError(401, 'Invalid or expired token');
  }

  const user = await User.findById(decoded.sub);
  if (!user) throw new ApiError(401, 'User no longer exists');

  req.user = user;
  next();
});
