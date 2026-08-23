const reviewService = require('../services/review.service');
const asyncHandler = require('../utils/asyncHandler');

exports.upsert = asyncHandler(async (req, res) => {
  const review = await reviewService.upsertReview(
    req.user._id,
    req.params.placeId,
    req.body
  );
  res.status(201).json({ review });
});

exports.list = asyncHandler(async (req, res) => {
  const reviews = await reviewService.listForPlace(req.params.placeId);
  res.status(200).json({ reviews });
});

exports.remove = asyncHandler(async (req, res) => {
  await reviewService.remove(req.user._id, req.user.role, req.params.id);
  res.status(200).json({ message: 'Review removed' });
});
