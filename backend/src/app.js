const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
const env = require('./config/env');

const authRoutes = require('./routes/auth.routes');
const placeRoutes = require('./routes/place.routes');
const bookingRoutes = require('./routes/booking.routes');
const reviewRoutes = require('./routes/review.routes');
const digilockerRoutes = require('./routes/digilocker.routes');
const uploadRoutes = require('./routes/upload.routes');

const { notFound, errorHandler } = require('./middleware/error.middleware');

const app = express();

app.use(helmet());

// Allow the configured frontend origins. CORS_ORIGIN can be a comma-separated
// list of origins for multi-environment setups (dev, staging, prod).
const allowedOrigins = env.CORS_ORIGIN
  ? env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : [];
app.use(
  cors({
    origin: (origin, cb) => {
      // Allow requests with no origin (curl, Postman, server-to-server).
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically.
app.use('/uploads', express.static(path.resolve(process.cwd(), env.UPLOAD_DIR)));

// Tighten the auth surface specifically.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
});

app.get('/health', (_req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/digilocker', digilockerRoutes);
app.use('/api/uploads', uploadRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
