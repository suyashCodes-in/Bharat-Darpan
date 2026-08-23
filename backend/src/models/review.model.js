const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    place: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true, maxlength: 1000 },
  },
  { timestamps: true }
);

// One review per user per place; updates reuse the same row.
reviewSchema.index({ user: 1, place: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
