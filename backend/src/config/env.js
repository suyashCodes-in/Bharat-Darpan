const dotenv = require('dotenv');
dotenv.config();

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 3000,

  // Required — no default, so a missing env var fails loudly on boot.
  MONGO_URI: process.env.MONGO_URI,

  JWT_SECRET: process.env.JWT_SECRET || 'change-me-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS, 10) || 12,

  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',
  MAX_UPLOAD_BYTES: parseInt(process.env.MAX_UPLOAD_BYTES, 10) || 5 * 1024 * 1024,

  // Comma-separated allowed origins for CORS (e.g. http://localhost:5173).
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',

  // Optional real DigiLocker verifier; if absent, the service runs in MOCK mode.
  DIGILOCKER_VERIFY_URL: process.env.DIGILOCKER_VERIFY_URL || null,
  DIGILOCKER_API_KEY: process.env.DIGILOCKER_API_KEY || null,
};

if (!env.MONGO_URI) {
  // Fail fast at boot if the connection string is missing rather than crashing
  // mid-request inside Mongoose.
  throw new Error('MONGO_URI is not set. Add it to your environment or .env file.');
}

module.exports = env;
