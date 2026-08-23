# Tourist Website Backend

A complete Express + MongoDB API for a tourist website. Built with Node.js 24, Express 5, and Mongoose 9.

## Features

- **Auth** — JWT-based, bcrypt-hashed passwords
- **Places** — destinations with photos, descriptions, location, ratings, specialties, famous features
- **Geo search** — 2dsphere index for "places near me"
- **Filters & search** — by category, city, rating, free-text
- **Bookings** — reserve a place, optionally with a verified guide
- **Reviews** — one per user per place; average rating auto-recomputed
- **Guide registration via DigiLocker** — identity verification promotes a tourist to a verified guide
- **Image uploads** — multipart uploads saved to disk and served at `/uploads/...`
- **Validation** — zod schemas with field-level errors
- **Centralized errors** — consistent JSON shape for ApiError, Mongoose, JWT

## Quick Start

```bash
npm install
cp .env.example .env   # optional — defaults to Atlas URI in src/config/env.js
npm start
```

Server runs on `http://localhost:3000` and connects to MongoDB Atlas by default.

### Seed an admin

```bash
node src/scripts/seed-admin.js admin@tourist.com adminpass
```

## Environment Variables

| Var | Default | Description |
| --- | --- | --- |
| `PORT` | `3000` | HTTP port |
| `MONGO_URI` | Atlas URI in `src/config/env.js` | MongoDB connection string |
| `JWT_SECRET` | `change-me-in-production` | HMAC secret for JWTs |
| `JWT_EXPIRES_IN` | `7d` | Token lifetime |
| `BCRYPT_ROUNDS` | `12` | Password hashing cost |
| `UPLOAD_DIR` | `uploads` | Where uploaded files are persisted |
| `MAX_UPLOAD_BYTES` | `5 MB` | Per-file size cap |
| `DIGILOCKER_VERIFY_URL` | _unset_ | If set, forward verification to this URL; otherwise MOCK mode |
| `DIGILOCKER_API_KEY` | _unset_ | Bearer token for the upstream verifier |

> **DigiLocker note:** The real DigiLocker partner API requires a registered OAuth client with the Government of India. The service runs in **MOCK** mode out of the box — it validates document format and marks the user verified. Set `DIGILOCKER_VERIFY_URL` (and optionally `DIGILOCKER_API_KEY`) to go live.

## API

### Auth

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | — | Register a tourist; returns `{ user, token }` |
| POST | `/api/auth/login` | — | Login; returns `{ user, token }` |
| GET | `/api/auth/me` | yes | Current user |
| PATCH | `/api/auth/me` | yes | Update profile (phone, languages, bio, ...) |

### Places

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/places` | — | List; filters: `q`, `category`, `city`, `minRating`, `limit`, `skip` |
| GET | `/api/places/nearby` | — | Geo: `lng`, `lat`, `radiusKm`, `limit` |
| GET | `/api/places/:idOrSlug` | — | Detail + recent reviews |
| POST | `/api/places` | admin | Create |
| PATCH | `/api/places/:id` | admin | Update |
| DELETE | `/api/places/:id` | admin | Delete |
| POST | `/api/places/:id/images` | admin | Multipart upload (field name `images`, max 10) |

### Bookings

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/bookings` | yes | Create a booking (optionally with a `guideId`) |
| GET | `/api/bookings/mine` | yes | My bookings |
| GET | `/api/bookings/:id` | yes | One booking (owner or admin) |
| PATCH | `/api/bookings/:id/cancel` | yes | Cancel |

### Reviews

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/reviews/places/:placeId` | yes | Upsert a review |
| GET | `/api/reviews/places/:placeId` | — | List reviews |
| DELETE | `/api/reviews/:id` | yes (owner/admin) | Remove |

### DigiLocker / Guides

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/digilocker/verify` | yes | Verify identity; on success the user is promoted to `guide` and `phone`/`languages`/`city`/`specialties`/`bio` are saved |
| GET | `/api/digilocker/guides` | — | List verified guides (filter: `city`, `language`) |
| GET | `/api/digilocker/guides/:id` | — | One guide |

### Uploads

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/uploads/image` | yes | Single image, field `image` |
| POST | `/api/uploads/images` | yes | Up to 10 images, field `images` |

Uploaded files are served at `/uploads/<filename>`.

## Project Layout

```
src/
├── app.js                 # middleware + route wiring
├── server.js              # boot
├── config/env.js          # env config
├── db/db.js               # mongoose connect
├── models/                # user, place, booking, review, digilocker
├── middleware/            # auth, role, upload, validate, error
├── services/              # business logic
├── controllers/           # HTTP adapters
├── routes/                # express routers
├── validators/            # zod schemas
├── utils/                 # ApiError, asyncHandler, token
└── scripts/seed-admin.js
```

## End-to-end smoke test

```bash
# health
curl http://localhost:3000/health

# register
curl -X POST http://localhost:3000/api/auth/register \
  -H "content-type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"secret123","phone":"9876543210"}'

# list places
curl http://localhost:3000/api/places

# nearby
curl "http://localhost:3000/api/places/nearby?lng=73.83&lat=15.55&radiusKm=10"

# become a guide (auth required)
curl -X POST http://localhost:3000/api/digilocker/verify \
  -H "authorization: Bearer $TOKEN" -H "content-type: application/json" \
  -d '{"documentType":"aadhaar","documentId":"123456789012","phone":"9876543210","languages":["English","Hindi"],"city":"Goa"}'
```
