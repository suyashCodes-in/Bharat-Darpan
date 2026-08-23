const router = require('express').Router();
const reviewController = require('../controllers/review.controller');
const auth = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const {
  createReviewSchema,
  placeIdParamSchema,
  reviewIdParamSchema,
} = require('../validators/review.schema');

router.get(
  '/places/:placeId',
  validate({ params: placeIdParamSchema }),
  reviewController.list
);
router.post(
  '/places/:placeId',
  auth,
  validate({ params: placeIdParamSchema, body: createReviewSchema }),
  reviewController.upsert
);
router.delete(
  '/:id',
  auth,
  validate({ params: reviewIdParamSchema }),
  reviewController.remove
);

module.exports = router;
