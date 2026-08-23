const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const { signToken } = require('../utils/token');

async function register({ name, email, password, phone }) {
  const exists = await User.findOne({ email });
  if (exists) throw new ApiError(409, 'Email already in use');

  const user = await User.create({ name, email, password, phone, role: 'tourist' });
  const token = signToken({ sub: user._id.toString(), role: user.role });
  return { user: user.toSafeJSON(), token };
}

async function login({ email, password }) {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new ApiError(401, 'Invalid credentials');

  const ok = await user.comparePassword(password);
  if (!ok) throw new ApiError(401, 'Invalid credentials');

  const token = signToken({ sub: user._id.toString(), role: user.role });
  return { user: user.toSafeJSON(), token };
}

async function getMe(userId) {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');
  return user.toSafeJSON();
}

async function updateMe(userId, patch) {
  const allowed = [
    'name',
    'phone',
    'avatarUrl',
    'bio',
    'city',
    'experienceYears',
    'languages',
    'specialties',
  ];
  const update = {};
  for (const k of allowed) if (k in patch) update[k] = patch[k];

  const user = await User.findByIdAndUpdate(userId, update, {
    new: true,
    runValidators: true,
  });
  if (!user) throw new ApiError(404, 'User not found');
  return user.toSafeJSON();
}

module.exports = { register, login, getMe, updateMe };
