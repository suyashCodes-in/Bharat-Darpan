const { z } = require('zod');
const { objectId } = require('./auth.schema');

const createBookingSchema = z.object({
  placeId: objectId,
  guideId: objectId.optional(),
  date: z.coerce.date().refine((d) => d.getTime() >= Date.now() - 60_000, {
    message: 'date must be in the future',
  }),
  numberOfPeople: z.number().int().min(1).max(50).default(1),
  totalAmount: z.number().min(0).optional(),
  contactPhone: z.string().trim().min(7).max(20).optional(),
  specialRequests: z.string().trim().max(500).optional(),
});

const bookingIdParamSchema = z.object({ id: objectId });

module.exports = { createBookingSchema, bookingIdParamSchema };
