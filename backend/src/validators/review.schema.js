const { z } = require('zod');
const { objectId } = require('./auth.schema');

const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().max(1000).optional(),
});

const placeIdParamSchema = z.object({ placeId: objectId });
const reviewIdParamSchema = z.object({ id: objectId });

module.exports = { createReviewSchema, placeIdParamSchema, reviewIdParamSchema };
