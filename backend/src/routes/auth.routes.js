const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const auth = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { registerSchema, loginSchema, updateMeSchema } = require('../validators/auth.schema');

router.post('/register', validate({ body: registerSchema }), authController.register);
router.post('/login', validate({ body: loginSchema }), authController.login);
router.get('/me', auth, authController.me);
router.patch('/me', auth, validate({ body: updateMeSchema }), authController.updateMe);

module.exports = router;
