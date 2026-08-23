const uploadService = require('../services/upload.service');
const asyncHandler = require('../utils/asyncHandler');

exports.uploadImage = asyncHandler(async (req, res) => {
  const saved = await uploadService.saveImages(req, req.files || []);
  res.status(201).json({ files: saved });
});
