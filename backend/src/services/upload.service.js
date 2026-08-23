const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');
const env = require('../config/env');

const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);
const EXT_BY_MIME = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

function pickExt(mimetype) {
  return EXT_BY_MIME[mimetype] || '.jpg';
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

function buildPublicUrl(req, filename) {
  // Server is assumed to serve /uploads statically.
  return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
}

/**
 * Persist an array of multer memory files to disk and return their public URLs.
 */
async function saveImages(req, files) {
  if (!files || !files.length) return [];
  const dir = path.resolve(process.cwd(), env.UPLOAD_DIR);
  await ensureDir(dir);

  const saved = [];
  for (const file of files) {
    const ext = pickExt(file.mimetype);
    if (!ALLOWED_EXT.has(ext)) continue;
    const id = crypto.randomBytes(12).toString('hex');
    const filename = `${Date.now()}-${id}${ext}`;
    await fs.writeFile(path.join(dir, filename), file.buffer);
    saved.push({ url: buildPublicUrl(req, filename), filename });
  }
  return saved;
}

module.exports = { saveImages };
