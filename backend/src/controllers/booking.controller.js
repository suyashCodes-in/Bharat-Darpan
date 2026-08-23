const bookingService = require('../services/booking.service');
const asyncHandler = require('../utils/asyncHandler');

exports.create = asyncHandler(async (req, res) => {
  const booking = await bookingService.createBooking(req.user._id, req.body);
  res.status(201).json({ booking });
});

exports.listMine = asyncHandler(async (req, res) => {
  const bookings = await bookingService.listMine(req.user._id);
  res.status(200).json({ bookings });
});

exports.get = asyncHandler(async (req, res) => {
  const booking = await bookingService.getById(req.user._id, req.user.role, req.params.id);
  res.status(200).json({ booking });
});

exports.cancel = asyncHandler(async (req, res) => {
  const booking = await bookingService.cancel(req.user._id, req.user.role, req.params.id);
  res.status(200).json({ booking });
});
