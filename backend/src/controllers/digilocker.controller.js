const digilockerService = require('../services/digilocker.service');
const asyncHandler = require('../utils/asyncHandler');
const { z } = require('zod');

// ── Strict schema (used by Postman / mobile / direct API consumers) ──────────
const digilockerSchema = z.object({
  documentType: z.enum(['aadhaar', 'pan', 'driving_license']),
  documentId: z.string().trim().min(4).max(40),
  fullName: z.string().trim().min(2).max(120).optional(),
  dob: z.coerce.date().optional(),
  phone: z.string().trim().min(7).max(20).optional(),
  languages: z.array(z.string().trim().min(1)).max(20).optional(),
  city: z.string().trim().max(80).optional(),
  experienceYears: z.number().int().min(0).max(80).optional(),
  specialties: z.array(z.string().trim().min(1)).max(20).optional(),
  bio: z.string().trim().max(1000).optional(),
});

// ── Frontend GuideFormData shape ─────────────────────────────────────────────
// Accepts the flat-string fields that RegisterGuideModal sends and normalises
// them to the service's expected shape before forwarding.
const frontendGuideSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),         // guide's display name (ignored — already on user)
  email: z.string().email().optional(),                        // ignored — already on user
  phone: z.string().trim().min(7).max(20).optional(),
  aadhar: z.string().trim().length(12),                        // 12-digit Aadhaar number
  location: z.string().trim().max(80).optional(),              // maps → city
  languages: z.string().trim().optional(),                     // comma-separated → string[]
  experience: z.coerce.number().int().min(0).max(80).optional(), // maps → experienceYears
  expertise: z.string().trim().optional(),                     // single value → specialties[0]
  about: z.string().trim().max(1000).optional(),               // maps → bio
});

function normaliseFrontendPayload(raw) {
  const f = frontendGuideSchema.parse(raw);
  return {
    documentType: 'aadhaar',
    documentId: f.aadhar,
    fullName: f.name,
    phone: f.phone,
    city: f.location,
    languages: f.languages
      ? f.languages.split(',').map((l) => l.trim()).filter(Boolean)
      : undefined,
    experienceYears: f.experience,
    specialties: f.expertise ? [f.expertise] : undefined,
    bio: f.about,
  };
}

exports.verify = asyncHandler(async (req, res) => {
  // Auto-detect which shape the client sent.
  const isFromFrontend = 'aadhar' in req.body;
  const parsed = isFromFrontend
    ? normaliseFrontendPayload(req.body)
    : digilockerSchema.parse(req.body);

  const result = await digilockerService.verifyAndRegisterGuide(req.user._id, parsed);
  res.status(200).json(result);
});

exports.listGuides = asyncHandler(async (req, res) => {
  const result = await digilockerService.listGuides(req.query);
  res.status(200).json(result);
});

exports.getGuide = asyncHandler(async (req, res) => {
  const guide = await digilockerService.getGuide(req.params.id);
  res.status(200).json({ guide });
});
