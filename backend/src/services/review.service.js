const Review = require('../models/review.model');
const Place = require('../models/place.model');
const ApiError = require('../utils/ApiError');

async function upsertReview(userId, placeId, { rating, comment }) {
  const place = await Place.findById(placeId);
  if (!place) throw new ApiError(404, 'Place not found');

  const review = await Review.findOneAndUpdate(
    { user: userId, place: placeId },
    { rating, comment },
    { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
  );

  await recomputePlaceRating(placeId);
  return review;
}

async function listForPlace(placeId) {
  return Review.find({ place: placeId })
    .populate('user', 'name avatarUrl')
    .sort({ createdAt: -1 });
}

async function remove(userId, role, id) {
  const review = await Review.findById(id);
  if (!review) throw new ApiError(404, 'Review not found');
  if (role !== 'admin' && review.user.toString() !== userId.toString()) {
    throw new ApiError(403, 'Not your review');
  }
  await review.deleteOne();
  await recomputePlaceRating(review.place);
}

async function recomputePlaceRating(placeId) {
  const agg = await Review.aggregate([
    { $match: { place: toObjectId(placeId) } },
    { $group: { _id: '$place', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  const { avg = 0, count = 0 } = agg[0] || {};
  await Place.findByIdAndUpdate(placeId, {
    averageRating: Math.round(avg * 10) / 10,
    reviewCount: count,
  });
}

function toObjectId(id) {
  const mongoose = require('mongoose');
  return new mongoose.Types.ObjectId(id);
}

module.exports = { upsertReview, listForPlace, remove };
