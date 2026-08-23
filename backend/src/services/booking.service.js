const Booking = require('../models/booking.model');
const Place = require('../models/place.model');
const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');

async function createBooking(userId, data) {
  const place = await Place.findById(data.placeId);
  if (!place || !place.isActive) throw new ApiError(404, 'Place not found');

  if (data.guideId) {
    const guide = await User.findById(data.guideId);
    if (!guide || guide.role !== 'guide' || !guide.digiLocker.verified) {
      throw new ApiError(400, 'Guide is not verified');
    }
  }

  return Booking.create({
    user: userId,
    place: data.placeId,
    guide: data.guideId || undefined,
    date: data.date,
    numberOfPeople: data.numberOfPeople,
    totalAmount: data.totalAmount ?? 0,
    contactPhone: data.contactPhone,
    specialRequests: data.specialRequests,
  });
}

async function listMine(userId) {
  return Booking.find({ user: userId })
    .populate('place', 'name slug coverImage city')
    .populate('guide', 'name avatarUrl languages')
    .sort({ date: -1 });
}

async function getById(userId, role, id) {
  const booking = await Booking.findById(id)
    .populate('place', 'name slug coverImage city')
    .populate('guide', 'name avatarUrl languages')
    .populate('user', 'name email phone');
  if (!booking) throw new ApiError(404, 'Booking not found');
  if (role !== 'admin' && booking.user._id.toString() !== userId.toString()) {
    throw new ApiError(403, 'Not your booking');
  }
  return booking;
}

async function cancel(userId, role, id) {
  const booking = await Booking.findById(id);
  if (!booking) throw new ApiError(404, 'Booking not found');
  if (role !== 'admin' && booking.user.toString() !== userId.toString()) {
    throw new ApiError(403, 'Not your booking');
  }
  if (booking.status === 'cancelled') return booking;
  if (booking.status === 'completed') throw new ApiError(400, 'Cannot cancel a completed booking');
  booking.status = 'cancelled';
  await booking.save();
  return booking;
}

module.exports = { createBooking, listMine, getById, cancel };
