const mongoose = require('mongoose');

const PLACE_CATEGORIES = [
  'beach',
  'mountain',
  'heritage',
  'adventure',
  'pilgrimage',
  'wildlife',
  'desert',
  'city',
  'island',
  'other',
];

const placeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    summary: { type: String, trim: true, maxlength: 280 },
    description: { type: String, required: true },

    // GeoJSON Point — [longitude, latitude]
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: {
        type: [Number],
        validate: {
          validator: (v) => Array.isArray(v) && v.length === 2,
          message: 'coordinates must be [lng, lat]',
        },
      },
    },
    address: { type: String, trim: true },
    city: { type: String, trim: true, index: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true },

    category: { type: String, enum: PLACE_CATEGORIES, default: 'other', index: true },

    // Highlights that make this place unique.
    specialties: { type: [String], default: [] },
    famousFeatures: { type: [String], default: [] },

    images: { type: [String], default: [] },
    coverImage: { type: String },

    entryFee: { type: Number, min: 0, default: 0 },
    bestTimeToVisit: { type: String, trim: true },
    timings: { type: String, trim: true },

    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

placeSchema.index({ location: '2dsphere' });
placeSchema.index({ name: 'text', description: 'text', summary: 'text', city: 'text' });

module.exports = mongoose.model('Place', placeSchema);
module.exports.PLACE_CATEGORIES = PLACE_CATEGORIES;
