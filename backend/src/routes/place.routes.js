const router = require('express').Router();
const placeController = require('../controllers/place.controller');
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');
const upload = require('../middleware/upload.middleware');
const validate = require('../middleware/validate.middleware');
const {
  createPlaceSchema,
  updatePlaceSchema,
  listPlacesQuerySchema,
  nearbyQuerySchema,
  placeIdParamSchema,
  objectId,
} = require('../validators/place.schema');
const { z } = require('zod');

const idParamSchema = z.object({ id: objectId });

router.get('/', validate({ query: listPlacesQuerySchema }), placeController.list);
router.get('/nearby', validate({ query: nearbyQuerySchema }), placeController.nearby);
router.get(
  '/:idOrSlug',
  validate({ params: placeIdParamSchema }),
  placeController.get
);

router.post(
  '/',
  auth,
  role('admin'),
  validate({ body: createPlaceSchema }),
  placeController.create
);
router.patch(
  '/:id',
  auth,
  role('admin'),
  validate({ params: idParamSchema, body: updatePlaceSchema }),
  placeController.update
);
router.delete(
  '/:id',
  auth,
  role('admin'),
  validate({ params: idParamSchema }),
  placeController.remove
);
router.post(
  '/:id/images',
  auth,
  role('admin'),
  upload.array('images', 10),
  validate({ params: idParamSchema }),
  placeController.uploadImages
);

module.exports = router;
