const mongoose = require('mongoose');

const VERIFICATION_STATUSES = ['pending', 'verified', 'rejected'];

const digilockerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    documentType: {
      type: String,
      enum: ['aadhaar', 'pan', 'driving_license'],
      required: true,
    },
    documentId: { type: String, required: true, trim: true },
    fullName: { type: String, trim: true },
    dob: { type: Date },
    status: { type: String, enum: VERIFICATION_STATUSES, default: 'pending' },
    verifiedAt: { type: Date },
    // Snapshot of the upstream response (or mock) for audit.
    rawResponse: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DigiLockerVerification', digilockerSchema);
module.exports.VERIFICATION_STATUSES = VERIFICATION_STATUSES;
