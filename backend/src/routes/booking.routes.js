const router = require('express').Router();
const bookingController = require('../controllers/booking.controller');
const auth = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { createBookingSchema, bookingIdParamSchema } = require('../validators/booking.schema');

router.use(auth);

router.post('/', validate({ body: createBookingSchema }), bookingController.create);
router.get('/mine', bookingController.listMine);
router.get('/:id', validate({ params: bookingIdParamSchema }), bookingController.get);
router.patch(
  '/:id/cancel',
  validate({ params: bookingIdParamSchema }),
  bookingController.cancel
);

module.exports = router;
