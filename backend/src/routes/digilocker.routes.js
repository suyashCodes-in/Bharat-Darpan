const router = require('express').Router();
const digilockerController = require('../controllers/digilocker.controller');
const auth = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { objectId } = require('../validators/auth.schema');
const { z } = require('zod');

const guideIdParam = z.object({ id: objectId });
const listGuidesQuery = z.object({
  city: z.string().trim().max(80).optional(),
  language: z.string().trim().max(40).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  skip: z.coerce.number().int().min(0).default(0),
});

// Verify identity via DigiLocker; on success the user is promoted to a guide.
router.post('/verify', auth, digilockerController.verify);

// Public guide directory.
router.get(
  '/guides',
  validate({ query: listGuidesQuery }),
  digilockerController.listGuides
);
router.get(
  '/guides/:id',
  validate({ params: guideIdParam }),
  digilockerController.getGuide
);

module.exports = router;
