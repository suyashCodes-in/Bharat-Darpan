const placeService = require('../services/place.service');
const uploadService = require('../services/upload.service');
const asyncHandler = require('../utils/asyncHandler');

exports.list = asyncHandler(async (req, res) => {
  const result = await placeService.listPlaces(req.query);
  res.status(200).json(result);
});

exports.nearby = asyncHandler(async (req, res) => {
  const items = await placeService.nearby(req.query);
  res.status(200).json({ items });
});

exports.get = asyncHandler(async (req, res) => {
  const { place, reviews } = await placeService.getPlaceWithReviews(req.params.idOrSlug);
  res.status(200).json({ place, reviews });
});

exports.create = asyncHandler(async (req, res) => {
  const place = await placeService.createPlace(req.body);
  res.status(201).json({ place });
});

exports.update = asyncHandler(async (req, res) => {
  const place = await placeService.updatePlace(req.params.id, req.body);
  res.status(200).json({ place });
});

exports.remove = asyncHandler(async (req, res) => {
  await placeService.deletePlace(req.params.id);
  res.status(200).json({ message: 'Place deleted' });
});

exports.uploadImages = asyncHandler(async (req, res) => {
  const saved = await uploadService.saveImages(req, req.files || []);
  const Place = require('../models/place.model');
  const place = await Place.findByIdAndUpdate(
    req.params.id,
    { $push: { images: { $each: saved.map((s) => s.url) } } },
    { new: true }
  );
  if (!place) {
    const err = new Error('Place not found');
    err.statusCode = 404;
    throw err;
  }
  res.status(201).json({ place, uploaded: saved });
});
