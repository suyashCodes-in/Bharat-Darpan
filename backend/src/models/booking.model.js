const mongoose = require('mongoose');

const BOOKING_STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'];

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    place: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true, index: true },
    guide: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    date: { type: Date, required: true },
    numberOfPeople: { type: Number, required: true, min: 1, max: 50 },
    totalAmount: { type: Number, min: 0, default: 0 },

    contactPhone: { type: String, trim: true },
    specialRequests: { type: String, trim: true, maxlength: 500 },

    status: { type: String, enum: BOOKING_STATUSES, default: 'pending', index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
module.exports.BOOKING_STATUSES = BOOKING_STATUSES;
