const Place = require('../models/place.model');
const Review = require('../models/review.model');
const ApiError = require('../utils/ApiError');

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function createPlace(data) {
  if (!data.slug) data.slug = slugify(data.name);
  const payload = { ...data };
  if (data.coordinates) {
    payload.location = { type: 'Point', coordinates: data.coordinates };
    delete payload.coordinates;
  }
  return Place.create(payload);
}

async function updatePlace(id, data) {
  const update = { ...data };
  if (data.coordinates) {
    update.location = { type: 'Point', coordinates: data.coordinates };
    delete update.coordinates;
  }
  const place = await Place.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  });
  if (!place) throw new ApiError(404, 'Place not found');
  return place;
}

async function deletePlace(id) {
  const place = await Place.findByIdAndDelete(id);
  if (!place) throw new ApiError(404, 'Place not found');
  return place;
}

async function listPlaces({ q, category, city, minRating, limit, skip }) {
  const filter = { isActive: true };
  if (category) filter.category = category;
  if (city) filter.city = new RegExp(`^${escapeRegex(city)}$`, 'i');
  if (typeof minRating === 'number') filter.averageRating = { $gte: minRating };
  if (q) filter.$text = { $search: q };

  const [items, total] = await Promise.all([
    Place.find(filter).sort({ averageRating: -1, reviewCount: -1 }).skip(skip).limit(limit),
    Place.countDocuments(filter),
  ]);
  return { items, total, limit, skip };
}

async function nearby({ lng, lat, radiusKm, limit }) {
  return Place.find({
    isActive: true,
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: [lng, lat] },
        $maxDistance: radiusKm * 1000,
      },
    },
  }).limit(limit);
}

async function getByIdOrSlug(idOrSlug) {
  const query = idOrSlug.match(/^[0-9a-fA-F]{24}$/)
    ? { _id: idOrSlug }
    : { slug: idOrSlug };
  const place = await Place.findOne(query);
  if (!place) throw new ApiError(404, 'Place not found');
  return place;
}

async function getPlaceWithReviews(idOrSlug) {
  const place = await getByIdOrSlug(idOrSlug);
  const reviews = await Review.find({ place: place._id })
    .populate('user', 'name avatarUrl')
    .sort({ createdAt: -1 })
    .limit(50);
  return { place, reviews };
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = {
  createPlace,
  updatePlace,
  deletePlace,
  listPlaces,
  nearby,
  getByIdOrSlug,
  getPlaceWithReviews,
};
