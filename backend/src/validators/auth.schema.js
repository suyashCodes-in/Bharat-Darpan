const { z } = require('zod');

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');

const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().email().toLowerCase(),
  password: z.string().min(6).max(128),
  phone: z.string().trim().min(7).max(20).optional(),
});

const loginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(6),
});

const updateMeSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  phone: z.string().trim().min(7).max(20).optional(),
  avatarUrl: z.string().url().optional(),
  bio: z.string().trim().max(1000).optional(),
  city: z.string().trim().max(80).optional(),
  experienceYears: z.number().int().min(0).max(80).optional(),
  languages: z.array(z.string().trim().min(1)).max(20).optional(),
  specialties: z.array(z.string().trim().min(1)).max(20).optional(),
});

module.exports = { objectId, registerSchema, loginSchema, updateMeSchema };
