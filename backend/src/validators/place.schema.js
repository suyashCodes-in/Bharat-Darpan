const { z } = require('zod');
const { PLACE_CATEGORIES } = require('../models/place.model');
const { objectId } = require('./auth.schema');

const coordsSchema = z
  .tuple([
    z.number().min(-180).max(180), // longitude
    z.number().min(-90).max(90), // latitude
  ])
  .or(
    z.array(z.number()).length(2).transform((arr) => {
      const [lng, lat] = arr;
      if (lng < -180 || lng > 180) throw new Error('longitude out of range');
      if (lat < -90 || lat > 90) throw new Error('latitude out of range');
      return [lng, lat];
    })
  );

const createPlaceSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9-]+$/, 'slug must be lowercase letters, numbers, and dashes'),
  summary: z.string().trim().max(280).optional(),
  description: z.string().min(1),
  coordinates: coordsSchema.optional(),
  address: z.string().trim().max(200).optional(),
  city: z.string().trim().max(80).optional(),
  state: z.string().trim().max(80).optional(),
  country: z.string().trim().max(80).optional(),
  category: z.enum(PLACE_CATEGORIES).optional(),
  specialties: z.array(z.string().trim().min(1)).max(20).optional(),
  famousFeatures: z.array(z.string().trim().min(1)).max(20).optional(),
  images: z.array(z.string().url()).max(20).optional(),
  coverImage: z.string().url().optional(),
  entryFee: z.number().min(0).optional(),
  bestTimeToVisit: z.string().trim().max(200).optional(),
  timings: z.string().trim().max(200).optional(),
});

const updatePlaceSchema = createPlaceSchema.partial();

const listPlacesQuerySchema = z.object({
  q: z.string().trim().max(120).optional(),
  category: z.enum(PLACE_CATEGORIES).optional(),
  city: z.string().trim().max(80).optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  skip: z.coerce.number().int().min(0).default(0),
});

const nearbyQuerySchema = z.object({
  lng: z.coerce.number().min(-180).max(180),
  lat: z.coerce.number().min(-90).max(90),
  radiusKm: z.coerce.number().min(0.1).max(20000).default(25),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

const placeIdParamSchema = z.object({
  idOrSlug: z.string().min(1),
});

module.exports = {
  createPlaceSchema,
  updatePlaceSchema,
  listPlacesQuerySchema,
  nearbyQuerySchema,
  placeIdParamSchema,
  objectId,
};
