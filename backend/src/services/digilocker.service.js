// DigiLocker verification service.
//
// The real DigiLocker partner API requires a registered OAuth client with the
// Government of India. This service is pluggable:
//   - If DIGILOCKER_VERIFY_URL is set, we forward the document for verification.
//   - Otherwise we run a MOCK flow that validates format and marks the user
//     verified. This keeps the backend runnable end-to-end without partner
//     credentials; swap the URL in env to go live.

const env = require('../config/env');
const DigiLockerVerification = require('../models/digilocker-verification.model');
const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');

const AADHAAR_RE = /^\d{12}$/;
const PAN_RE = /^[A-Z]{5}\d{4}[A-Z]$/;
const DL_RE = /^[A-Z]{2}\d{2}\d{11}$/;

function validateDocumentFormat(documentType, documentId) {
  const id = String(documentId || '').trim().toUpperCase();
  if (documentType === 'aadhaar' && !AADHAAR_RE.test(id)) {
    throw new ApiError(400, 'Aadhaar must be 12 digits');
  }
  if (documentType === 'pan' && !PAN_RE.test(id)) {
    throw new ApiError(400, 'PAN must look like ABCDE1234F');
  }
  if (documentType === 'driving_license' && !DL_RE.test(id)) {
    throw new ApiError(400, 'Driving license must look like MH12XXXXXXXXX');
  }
  return id;
}

async function callUpstream({ documentType, documentId, fullName, dob }) {
  if (!env.DIGILOCKER_VERIFY_URL) {
    // MOCK: format-checked data is treated as verified.
    return { ok: true, source: 'mock', payload: { documentType, documentId, fullName, dob } };
  }
  const res = await fetch(env.DIGILOCKER_VERIFY_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(env.DIGILOCKER_API_KEY ? { authorization: `Bearer ${env.DIGILOCKER_API_KEY}` } : {}),
    },
    body: JSON.stringify({ documentType, documentId, fullName, dob }),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok && data.status !== 'rejected', source: 'upstream', payload: data };
}

/**
 * Verify a user via DigiLocker and, on success, promote them to a guide.
 * The request must include the guide profile fields (phone, languages, etc.)
 * that should be applied to the user account.
 */
async function verifyAndRegisterGuide(userId, payload) {
  const { documentType, documentId, fullName, dob } = payload;
  const documentIdClean = validateDocumentFormat(documentType, documentId);

  const result = await callUpstream({ documentType, documentId: documentIdClean, fullName, dob });

  const record = await DigiLockerVerification.create({
    user: userId,
    documentType,
    documentId: documentIdClean,
    fullName,
    dob,
    status: result.ok ? 'verified' : 'rejected',
    verifiedAt: result.ok ? new Date() : undefined,
    rawResponse: result.payload,
  });

  if (!result.ok) throw new ApiError(400, 'DigiLocker verification failed');

  const update = {
    'digiLocker.verified': true,
    'digiLocker.documentId': documentIdClean,
    'digiLocker.documentType': documentType,
    'digiLocker.verifiedAt': new Date(),
    role: 'guide',
  };
  if (payload.phone) update.phone = payload.phone;
  if (Array.isArray(payload.languages) && payload.languages.length) {
    update.languages = payload.languages;
  }
  if (payload.city) update.city = payload.city;
  if (typeof payload.experienceYears === 'number') update.experienceYears = payload.experienceYears;
  if (Array.isArray(payload.specialties) && payload.specialties.length) {
    update.specialties = payload.specialties;
  }
  if (payload.bio) update.bio = payload.bio;

  const user = await User.findByIdAndUpdate(userId, update, { new: true });
  if (!user) throw new ApiError(404, 'User not found');

  return { verification: record, user: user.toSafeJSON() };
}

async function listGuides({ city, language, limit = 20, skip = 0 }) {
  const filter = { role: 'guide', 'digiLocker.verified': true };
  if (city) filter.city = new RegExp(`^${escapeRegex(city)}$`, 'i');
  if (language) filter.languages = language;

  const User = require('../models/user.model');
  const [items, total] = await Promise.all([
    User.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
    User.countDocuments(filter),
  ]);
  return {
    items: items.map((u) => u.toSafeJSON()),
    total,
    limit,
    skip,
  };
}

async function getGuide(id) {
  const User = require('../models/user.model');
  const guide = await User.findOne({ _id: id, role: 'guide', 'digiLocker.verified': true });
  if (!guide) throw new ApiError(404, 'Guide not found');
  return guide.toSafeJSON();
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = { verifyAndRegisterGuide, listGuides, getGuide };
