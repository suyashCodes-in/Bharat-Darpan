const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const env = require('../config/env');

const ROLES = ['tourist', 'guide', 'admin'];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: { type: String, required: true, minlength: 6, select: false },
    phone: { type: String, trim: true },
    role: { type: String, enum: ROLES, default: 'tourist', index: true },

    // Guide-specific fields (only meaningful when role === 'guide').
    languages: { type: [String], default: [] },
    city: { type: String, trim: true },
    experienceYears: { type: Number, min: 0 },
    specialties: { type: [String], default: [] },
    bio: { type: String, trim: true, maxlength: 1000 },

    avatarUrl: { type: String },

    digiLocker: {
      verified: { type: Boolean, default: false },
      documentId: { type: String },
      documentType: { type: String, enum: ['aadhaar', 'pan', 'driving_license', null], default: null },
      verifiedAt: { type: Date },
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, env.BCRYPT_ROUNDS);
});

userSchema.methods.comparePassword = function comparePassword(plain) {
  return bcrypt.compare(plain, this.password);
};

userSchema.methods.toSafeJSON = function toSafeJSON() {
  const obj = this.toObject({ versionKey: false });
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
module.exports.ROLES = ROLES;
