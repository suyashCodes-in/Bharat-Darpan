const router = require('express').Router();
const uploadController = require('../controllers/upload.controller');
const auth = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router.post('/image', auth, upload.single('image'), uploadController.uploadImage);
router.post('/images', auth, upload.array('images', 10), uploadController.uploadImage);

module.exports = router;
